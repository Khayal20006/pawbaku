package com.example.pawbaku.service;

import java.time.Instant;
import java.util.List;

import com.example.pawbaku.dto.ReportRequest;
import com.example.pawbaku.dto.ReportResponse;
import com.example.pawbaku.dto.ReportStatusRequest;
import com.example.pawbaku.exception.ForbiddenException;
import com.example.pawbaku.exception.InvalidStateTransitionException;
import com.example.pawbaku.exception.ResourceNotFoundException;
import com.example.pawbaku.model.Report;
import com.example.pawbaku.model.ReportEvent;
import com.example.pawbaku.model.User;
import com.example.pawbaku.repository.ReportEventRepository;
import com.example.pawbaku.repository.ReportRepository;
import com.example.pawbaku.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Street-animal help reports. The lifecycle is strictly linear and each step is gated by
 * the role responsible for it:
 * REPORTED → VERIFIED (moderator) → VOLUNTEER_ASSIGNED (volunteer/staff) →
 * VET_CARE (volunteer/vet/staff) → RESOLVED (vet/staff).
 */
@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final ReportEventRepository eventRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    public ReportService(ReportRepository reportRepository,
                         ReportEventRepository eventRepository,
                         UserRepository userRepository,
                         CurrentUserService currentUserService) {
        this.reportRepository = reportRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional
    public ReportResponse create(ReportRequest request) {
        User reporter = currentUserService.require();
        Report report = Report.builder()
                .title(request.title().trim())
                .description(request.description().trim())
                .species(request.species())
                .district(request.district().trim())
                .address(request.address() == null ? null : request.address().trim())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .photoUrl(request.photoUrl())
                .reporter(reporter)
                .status(Report.Status.REPORTED)
                .build();
        report = reportRepository.save(report);

        ReportEvent event = ReportEvent.builder()
                .report(report)
                .fromStatus(null)
                .toStatus(Report.Status.REPORTED)
                .actor(reporter)
                .note("Bildiriş qeydə alındı")
                .build();
        eventRepository.save(event);

        return ReportResponse.of(report, eventRepository.findByReportIdOrderByIdAsc(report.getId()));
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> feed() {
        return reportRepository.findFeed().stream()
                .map(report -> ReportResponse.of(report, eventRepository.findByReportIdOrderByIdAsc(report.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public ReportResponse findById(Long id) {
        Report report = requireReport(id);
        return ReportResponse.of(report, eventRepository.findByReportIdOrderByIdAsc(id));
    }

    @Transactional
    public ReportResponse transition(Long id, ReportStatusRequest request) {
        User actor = currentUserService.require();
        Report report = requireReport(id);

        Report.Status next = report.nextStatus();
        if (next == null) {
            throw new InvalidStateTransitionException(
                    "Axın artıq tamamlanıb (" + report.getStatus() + ")", List.of());
        }
        if (request.status() != next) {
            throw new InvalidStateTransitionException(
                    "Yalnız növbəti statusa keçmək olar: " + next, List.of(next.name()));
        }

        switch (next) {
            case VERIFIED -> {
                requireStaff(actor);
                report.setVerifiedBy(actor);
            }
            case VOLUNTEER_ASSIGNED -> assignVolunteer(report, actor, request.volunteerId());
            case VET_CARE -> assignVet(report, actor, request.vetId());
            case RESOLVED -> {
                if (!actor.isStaff() && actor.getRole() != User.Role.VET
                        && !isSelf(report.getVolunteer(), actor)) {
                    throw new ForbiddenException("Axını yalnız baytar və ya personal bağlaya bilər");
                }
                report.setResolvedAt(Instant.now());
            }
            default -> throw new IllegalStateException("Bilinməyən keçid: " + next);
        }

        Report.Status from = report.getStatus();
        report.setStatus(next);
        report = reportRepository.save(report);

        eventRepository.save(ReportEvent.builder()
                .report(report)
                .fromStatus(from)
                .toStatus(next)
                .actor(actor)
                .note(request.note())
                .build());

        return ReportResponse.of(report, eventRepository.findByReportIdOrderByIdAsc(report.getId()));
    }

    private void assignVolunteer(Report report, User actor, Long requestedVolunteerId) {
        if (actor.isStaff() && requestedVolunteerId != null) {
            User volunteer = currentUserService.requireAssignable(requestedVolunteerId);
            if (volunteer.getRole() != User.Role.VOLUNTEER) {
                throw new ForbiddenException("Təyin edilən istifadəçi könüllü deyil");
            }
            report.setVolunteer(volunteer);
            return;
        }
        if (actor.getRole() == User.Role.VOLUNTEER) {
            report.setVolunteer(actor);
            return;
        }
        if (actor.isStaff()) {
            User volunteer = userRepository.findFirstByRoleAndActiveTrueOrderByIdAsc(User.Role.VOLUNTEER)
                    .orElseThrow(() -> new ForbiddenException("Hazırda aktiv könüllü yoxdur"));
            report.setVolunteer(volunteer);
            return;
        }
        throw new ForbiddenException("Bu addım könüllü tərəfindən və ya moderator tərəfindən edilir");
    }

    private void assignVet(Report report, User actor, Long requestedVetId) {
        if (actor.isStaff() && requestedVetId != null) {
            User vet = currentUserService.requireAssignable(requestedVetId);
            if (vet.getRole() != User.Role.VET) {
                throw new ForbiddenException("Təyin edilən istifadəçi baytar deyil");
            }
            report.setVet(vet);
            return;
        }
        if (actor.getRole() == User.Role.VET) {
            report.setVet(actor);
            return;
        }
        if (actor.isStaff() || isSelf(report.getVolunteer(), actor)) {
            User vet = userRepository.findFirstByRoleAndActiveTrueOrderByIdAsc(User.Role.VET)
                    .orElseThrow(() -> new ForbiddenException("Hazırda aktiv baytar yoxdur"));
            report.setVet(vet);
            return;
        }
        throw new ForbiddenException("Bu addım baytar, təyin olunmuş könüllü və ya personal tərəfindən edilir");
    }

    private void requireStaff(User actor) {
        if (!actor.isStaff()) {
            throw new ForbiddenException("Təsdiq yalnız moderator/admin tərəfindən edilir");
        }
    }

    private boolean isSelf(User assignee, User actor) {
        return assignee != null && actor.getId().equals(assignee.getId());
    }

    private Report requireReport(Long id) {
        return reportRepository.findWithPeopleById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Bildiriş", id));
    }
}
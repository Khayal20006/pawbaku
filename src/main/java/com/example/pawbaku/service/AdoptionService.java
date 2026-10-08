package com.example.pawbaku.service;

import java.util.List;

import com.example.pawbaku.dto.ApplicationResponse;
import com.example.pawbaku.dto.PetRequest;
import com.example.pawbaku.dto.PetResponse;
import com.example.pawbaku.exception.ConflictException;
import com.example.pawbaku.exception.ResourceNotFoundException;
import com.example.pawbaku.model.AdoptablePet;
import com.example.pawbaku.model.AdoptionApplication;
import com.example.pawbaku.model.Animal;
import com.example.pawbaku.model.User;
import com.example.pawbaku.repository.AdoptablePetRepository;
import com.example.pawbaku.repository.AdoptionApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Övladlığa götürmə: public pet profiles plus authenticated applications. */
@Service
public class AdoptionService {

    private final AdoptablePetRepository petRepository;
    private final AdoptionApplicationRepository applicationRepository;
    private final CurrentUserService currentUserService;

    public AdoptionService(AdoptablePetRepository petRepository,
                           AdoptionApplicationRepository applicationRepository,
                           CurrentUserService currentUserService) {
        this.petRepository = petRepository;
        this.applicationRepository = applicationRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<PetResponse> listAvailable() {
        return petRepository.findByStatusOrderByIdDesc(AdoptablePet.PetStatus.AVAILABLE).stream()
                .map(PetResponse::of)
                .toList();
    }

    @Transactional(readOnly = true)
    public PetResponse findById(Long id) {
        AdoptablePet pet = requirePet(id);
        return PetResponse.of(pet);
    }

    /** Any logged-in user can offer a pet for adoption (community-run shelter). */
    @Transactional
    public PetResponse createPet(PetRequest request) {
        User actor = currentUserService.require();
        AdoptablePet pet = AdoptablePet.builder()
                .name(request.name().trim())
                .species(request.species())
                .breed(trimToNull(request.breed()))
                .gender(request.gender() == null ? Animal.Gender.UNKNOWN : request.gender())
                .ageMonths(request.ageMonths())
                .size(request.size())
                .color(trimToNull(request.color()))
                .about(trimToNull(request.about()))
                .photoUrl(trimToNull(request.photoUrl()))
                .createdBy(actor)
                .status(AdoptablePet.PetStatus.AVAILABLE)
                .build();
        return PetResponse.of(petRepository.save(pet));
    }

    @Transactional
    public ApplicationResponse apply(Long petId, String message) {
        User actor = currentUserService.require();
        AdoptablePet pet = requirePet(petId);
        if (pet.getStatus() != AdoptablePet.PetStatus.AVAILABLE) {
            throw new ConflictException("Bu heyvan artıq övladlığa götürülüb");
        }
        AdoptionApplication application = AdoptionApplication.builder()
                .pet(pet)
                .applicant(actor)
                .message(trimToNull(message))
                .build();
        return ApplicationResponse.of(applicationRepository.save(application));
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> mine() {
        User actor = currentUserService.require();
        return applicationRepository.findByApplicantIdOrderByIdDesc(actor.getId()).stream()
                .map(ApplicationResponse::of)
                .toList();
    }

    private AdoptablePet requirePet(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Övladlığa götürmə", id));
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
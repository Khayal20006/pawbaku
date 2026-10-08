package com.example.pawbaku.controller;

import java.util.List;

import com.example.pawbaku.dto.ReportRequest;
import com.example.pawbaku.dto.ReportResponse;
import com.example.pawbaku.dto.ReportStatusRequest;
import com.example.pawbaku.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /** Public live feed, newest first. */
    @GetMapping
    public List<ReportResponse> feed() {
        return reportService.feed();
    }

    @GetMapping("/{id}")
    public ReportResponse findById(@PathVariable Long id) {
        return reportService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ReportResponse> create(@Valid @RequestBody ReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.create(request));
    }

    /** Role-gated lifecycle transition: VERIFIED → VOLUNTEER_ASSIGNED → VET_CARE → RESOLVED. */
    @PatchMapping("/{id}/status")
    public ReportResponse transition(@PathVariable Long id,
                                     @Valid @RequestBody ReportStatusRequest request) {
        return reportService.transition(id, request);
    }
}
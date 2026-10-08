package com.example.pawbaku.controller;

import java.util.List;

import com.example.pawbaku.dto.ApplicationResponse;
import com.example.pawbaku.dto.ApplicationStatusRequest;
import com.example.pawbaku.dto.PetRequest;
import com.example.pawbaku.dto.PetResponse;
import com.example.pawbaku.service.AdoptionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
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
@RequestMapping("/api/adoptions")
public class AdoptionController {

    private final AdoptionService adoptionService;

    public AdoptionController(AdoptionService adoptionService) {
        this.adoptionService = adoptionService;
    }

    /** Public list of adoptable pets. */
    @GetMapping
    public List<PetResponse> list() {
        return adoptionService.listAvailable();
    }

    @GetMapping("/{id}")
    public PetResponse findById(@PathVariable Long id) {
        return adoptionService.findById(id);
    }

    /** Community offer: any logged-in user can add an adoptable pet. */
    @PostMapping
    public ResponseEntity<PetResponse> create(@Valid @RequestBody PetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adoptionService.createPet(request));
    }

    /** Apply for a pet — needs an account. */
    @PostMapping("/{id}/applications")
    public ResponseEntity<ApplicationResponse> apply(@PathVariable Long id,
                                                     @RequestBody(required = false) ApplicationRequest request) {
        String message = request == null ? null : request.message();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adoptionService.apply(id, message));
    }

    /** The caller's own applications — lives under its own literal path to avoid the /{id} route. */
    @GetMapping("/mine/applications")
    public List<ApplicationResponse> mine() {
        return adoptionService.mine();
    }

    /** Applications received on the caller's pets (staff: every application). */
    @GetMapping("/applications/received")
    public List<ApplicationResponse> received() {
        return adoptionService.received();
    }

    /** Owner or staff approve/reject a pending application. */
    @PatchMapping("/applications/{id}/status")
    public ApplicationResponse review(@PathVariable Long id,
                                      @Valid @RequestBody ApplicationStatusRequest request) {
        return adoptionService.review(id, request.status());
    }

    public record ApplicationRequest(@Size(max = 1200, message = "Mesaj ən çox 1200 simvol ola bilər") String message) {
    }
}
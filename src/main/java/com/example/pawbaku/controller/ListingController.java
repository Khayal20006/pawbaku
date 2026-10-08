package com.example.pawbaku.controller;

import com.example.pawbaku.dto.ListingRequest;
import com.example.pawbaku.dto.ListingResponse;
import com.example.pawbaku.dto.ListingStatusRequest;
import com.example.pawbaku.dto.PageResponse;
import com.example.pawbaku.model.Listing;
import com.example.pawbaku.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    /** Public grid feed; optional kind/status filters. */
    @GetMapping
    public PageResponse<ListingResponse> findAll(@RequestParam(required = false) Listing.Kind kind,
                                                 @RequestParam(required = false) Listing.Status status,
                                                 @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "20") int size) {
        return listingService.findAll(kind, status, page, size);
    }

    @GetMapping("/{id}")
    public ListingResponse findById(@PathVariable Long id) {
        return listingService.findById(id);
    }

    @PostMapping
    public ResponseEntity<ListingResponse> create(@Valid @RequestBody ListingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(listingService.create(request));
    }

    /** Owner or staff close/reopen a listing — drops it out of the active match pool. */
    @PatchMapping("/{id}/status")
    public ListingResponse changeStatus(@PathVariable Long id,
                                        @Valid @RequestBody ListingStatusRequest request) {
        return listingService.changeStatus(id, request.status());
    }
}
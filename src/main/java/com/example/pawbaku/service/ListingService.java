package com.example.pawbaku.service;

import com.example.pawbaku.dto.ListingRequest;
import com.example.pawbaku.dto.ListingResponse;
import com.example.pawbaku.dto.PageResponse;
import com.example.pawbaku.exception.ResourceNotFoundException;
import com.example.pawbaku.model.Animal;
import com.example.pawbaku.model.Listing;
import com.example.pawbaku.model.User;
import com.example.pawbaku.repository.AnimalRepository;
import com.example.pawbaku.repository.ListingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** İtkin / Tapılmış elanı: read-only public feed plus creation for logged-in users. */
@Service
public class ListingService {

    private final ListingRepository listingRepository;
    private final AnimalRepository animalRepository;
    private final CurrentUserService currentUserService;

    public ListingService(ListingRepository listingRepository,
                          AnimalRepository animalRepository,
                          CurrentUserService currentUserService) {
        this.listingRepository = listingRepository;
        this.animalRepository = animalRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public PageResponse<ListingResponse> findAll(Listing.Kind kind, Listing.Status status,
                                                 int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 200));
        Page<Listing> result = listingRepository.search(kind, status, pageable);
        return PageResponse.of(result.map(listing ->
                ListingResponse.of(listing, ListingResponse.demoMatchScore(listing.getId()))));
    }

    @Transactional(readOnly = true)
    public ListingResponse findById(Long id) {
        Listing listing = listingRepository.findWithAnimalById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Elan", id));
        return ListingResponse.of(listing, ListingResponse.demoMatchScore(listing.getId()));
    }

    @Transactional
    public ListingResponse create(ListingRequest request) {
        User creator = currentUserService.require();
        ListingRequest.AnimalInput animalInput = request.animal();

        Animal animal = Animal.builder()
                .name(blankToNull(animalInput.name()))
                .species(animalInput.species())
                .breed(blankToNull(animalInput.breed()))
                .color(blankToNull(animalInput.color()))
                .size(animalInput.size())
                .gender(animalInput.gender() == null ? Animal.Gender.UNKNOWN : animalInput.gender())
                .ageMonths(animalInput.ageMonths())
                .photoUrl(blankToNull(animalInput.photoUrl()))
                .createdBy(creator)
                .build();
        animal = animalRepository.save(animal);

        Listing listing = Listing.builder()
                .kind(request.kind())
                .status(Listing.Status.ACTIVE)
                .latitude(request.latitude())
                .longitude(request.longitude())
                .district(request.district().trim())
                .address(blankToNull(request.address()))
                .description(blankToNull(request.description()))
                .createdBy(creator)
                .animal(animal)
                .build();
        listing = listingRepository.save(listing);
        return ListingResponse.of(listing, ListingResponse.demoMatchScore(listing.getId()));
    }

    private static String blankToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
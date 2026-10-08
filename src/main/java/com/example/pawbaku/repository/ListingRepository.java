package com.example.pawbaku.repository;

import java.util.List;
import java.util.Optional;

import com.example.pawbaku.model.Listing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    @EntityGraph(attributePaths = {"animal"})
    @Query("""
            select l from Listing l
            where (:kind is null or l.kind = :kind)
              and (:status is null or l.status = :status)
            order by l.createdAt desc
            """)
    Page<Listing> search(@Param("kind") Listing.Kind kind,
                         @Param("status") Listing.Status status,
                         Pageable pageable);

    @EntityGraph(attributePaths = {"animal"})
    @Query("select l from Listing l where l.id = :id")
    java.util.Optional<Listing> findWithAnimalById(@Param("id") Long id);

    @EntityGraph(attributePaths = {"animal"})
    List<Listing> findByStatusAndKind(Listing.Status status, Listing.Kind kind);

    @EntityGraph(attributePaths = {"animal"})
    List<Listing> findByStatus(Listing.Status status);

    long countByStatus(Listing.Status status);
}
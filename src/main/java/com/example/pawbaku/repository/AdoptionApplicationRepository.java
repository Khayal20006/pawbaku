package com.example.pawbaku.repository;

import java.util.List;

import com.example.pawbaku.model.AdoptionApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AdoptionApplicationRepository extends JpaRepository<AdoptionApplication, Long> {

    @Query("""
            SELECT app FROM AdoptionApplication app
            JOIN FETCH app.pet pet
            WHERE app.applicant.id = :applicantId
            ORDER BY app.id DESC
            """)
    List<AdoptionApplication> findByApplicantIdOrderByIdDesc(@Param("applicantId") Long applicantId);

    /** Applications received on the caller's own pets. */
    @Query("""
            SELECT app FROM AdoptionApplication app
            JOIN FETCH app.pet pet
            JOIN FETCH app.applicant applicant
            WHERE pet.createdBy.id = :ownerId
            ORDER BY app.id DESC
            """)
    List<AdoptionApplication> findByPetCreatedByIdOrderByIdDesc(@Param("ownerId") Long ownerId);

    /** Every application with people loaded — the staff view. */
    @Query("""
            SELECT app FROM AdoptionApplication app
            JOIN FETCH app.pet pet
            JOIN FETCH app.applicant applicant
            ORDER BY app.id DESC
            """)
    List<AdoptionApplication> findAllWithDetails();

    /** Still-open applications for one pet (used to reject the rivals on approval). */
    @Query("""
            SELECT app FROM AdoptionApplication app
            JOIN FETCH app.pet pet
            WHERE app.pet.id = :petId
              AND app.status = com.example.pawbaku.model.AdoptionApplication.ApplicationStatus.PENDING
            """)
    List<AdoptionApplication> findPendingByPetId(@Param("petId") Long petId);
}
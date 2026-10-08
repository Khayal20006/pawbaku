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
}
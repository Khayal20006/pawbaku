package com.example.pawbaku.repository;

import java.util.List;
import java.util.Optional;

import com.example.pawbaku.model.Report;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReportRepository extends JpaRepository<Report, Long> {

    @EntityGraph(attributePaths = {"reporter", "volunteer", "vet", "verifiedBy"})
    @Query("select r from Report r order by r.createdAt desc")
    List<Report> findFeed();

    @EntityGraph(attributePaths = {"reporter", "volunteer", "vet", "verifiedBy"})
    Optional<Report> findWithPeopleById(Long id);

    long countByStatus(Report.Status status);
}
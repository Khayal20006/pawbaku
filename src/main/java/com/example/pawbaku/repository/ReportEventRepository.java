package com.example.pawbaku.repository;

import java.util.List;

import com.example.pawbaku.model.ReportEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportEventRepository extends JpaRepository<ReportEvent, Long> {

    List<ReportEvent> findByReportIdOrderByIdAsc(Long reportId);

    // Used by the audit trail of a report.
    long countByReportId(Long reportId);
}
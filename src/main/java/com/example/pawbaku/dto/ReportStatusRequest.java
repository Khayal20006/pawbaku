package com.example.pawbaku.dto;

import com.example.pawbaku.model.Report;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Body for {@code PATCH /api/reports/{id}/status}. Only the immediate next status is
 * accepted; {@code volunteerId} / {@code vetId} carry the assignment for that step.
 */
public record ReportStatusRequest(
        @NotNull(message = "Hədəf status tələb olunur")
        Report.Status status,

        Long volunteerId,

        Long vetId,

        @Size(max = 500, message = "Qeyd ən çox 500 simvol ola bilər")
        String note) {
}
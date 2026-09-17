package com.devflow.dto.request;

import com.devflow.enums.IncidentSeverity;
import com.devflow.enums.IncidentStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentRequest {

    @NotBlank(message = "Incident title cannot be blank")
    private String title;

    private String description;

    @NotNull(message = "ProjectId is required")
    private Long projectId;

    @NotNull(message = "Severity is required")
    private IncidentSeverity severity;

    private IncidentStatus status; // Defaults to OPEN if null

    private Long assignedToUserId;
}

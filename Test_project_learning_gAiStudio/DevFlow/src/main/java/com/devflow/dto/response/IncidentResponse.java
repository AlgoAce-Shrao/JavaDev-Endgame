package com.devflow.dto.response;

import com.devflow.enums.IncidentSeverity;
import com.devflow.enums.IncidentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {

    private Long id;
    private String title;
    private String description;
    private IncidentSeverity severity;
    private IncidentStatus status;
    private Long projectId;
    private String projectName;
    private UserResponse reportedBy;
    private UserResponse assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}

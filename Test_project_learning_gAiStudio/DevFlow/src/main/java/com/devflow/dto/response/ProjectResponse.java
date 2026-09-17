package com.devflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private UserResponse owner;
    private int taskCount;
    private int incidentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

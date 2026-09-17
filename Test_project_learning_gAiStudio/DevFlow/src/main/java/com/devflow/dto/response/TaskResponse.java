package com.devflow.dto.response;

import com.devflow.enums.Priority;
import com.devflow.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private TaskStatus status;
    private LocalDateTime dueDate;
    private Long projectId;
    private String projectName;
    private UserResponse assignedTo;
    private UserResponse createdBy;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

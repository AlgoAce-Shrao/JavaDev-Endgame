package com.devflow.dto.request;

import com.devflow.enums.Priority;
import com.devflow.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Task title cannot be blank")
    private String title;

    private String description;

    @NotNull(message = "ProjectId is required")
    private Long projectId;

    @NotNull(message = "Priority is required")
    private Priority priority;

    private TaskStatus status; // Defaults to TODO if null

    private LocalDateTime dueDate;

    private Long assignedToUserId;
}

package com.devflow.controller;

import com.devflow.dto.request.TaskAssignRequest;
import com.devflow.dto.request.TaskRequest;
import com.devflow.dto.request.TaskStatusUpdateRequest;
import com.devflow.dto.response.TaskResponse;
import com.devflow.security.CurrentUser;
import com.devflow.security.UserPrincipal;
import com.devflow.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Endpoints for managing developer tasks")
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Create task", description = "Creates a new task within a project")
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            @CurrentUser UserPrincipal currentUser) {
        TaskResponse response = taskService.createTask(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID", description = "Retrieves task details by ID")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long id,
            @CurrentUser UserPrincipal currentUser) {
        TaskResponse response = taskService.getTaskById(id, currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task", description = "Updates an existing task")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            @CurrentUser UserPrincipal currentUser) {
        TaskResponse response = taskService.updateTask(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Delete task", description = "Deletes a task by ID")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @CurrentUser UserPrincipal currentUser) {
        taskService.deleteTask(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status", description = "Updates status of a task")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody TaskStatusUpdateRequest request,
            @CurrentUser UserPrincipal currentUser) {
        TaskResponse response = taskService.updateTaskStatus(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Assign task", description = "Assigns a task to a user")
    public ResponseEntity<TaskResponse> assignTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskAssignRequest request,
            @CurrentUser UserPrincipal currentUser) {
        TaskResponse response = taskService.assignTask(id, request, currentUser);
        return ResponseEntity.ok(response);
    }
}

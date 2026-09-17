package com.devflow.controller;

import com.devflow.dto.request.ProjectRequest;
import com.devflow.dto.response.IncidentResponse;
import com.devflow.dto.response.PageResponse;
import com.devflow.dto.response.ProjectResponse;
import com.devflow.dto.response.TaskResponse;
import com.devflow.enums.IncidentSeverity;
import com.devflow.enums.IncidentStatus;
import com.devflow.enums.Priority;
import com.devflow.enums.TaskStatus;
import com.devflow.security.CurrentUser;
import com.devflow.security.UserPrincipal;
import com.devflow.service.IncidentService;
import com.devflow.service.ProjectService;
import com.devflow.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Endpoints for managing projects, their tasks, and incidents")
public class ProjectController {

    private final ProjectService projectService;
    private final TaskService taskService;
    private final IncidentService incidentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Create project", description = "Creates a new project. Requires ADMIN or MANAGER role.")
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            @CurrentUser UserPrincipal currentUser) {
        ProjectResponse response = projectService.createProject(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all projects", description = "Retrieves projects accessible to the authenticated user")
    public ResponseEntity<List<ProjectResponse>> getAllProjects(@CurrentUser UserPrincipal currentUser) {
        List<ProjectResponse> projects = projectService.getAllProjects(currentUser);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID", description = "Retrieves project details by ID with Redis caching")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable Long id,
            @CurrentUser UserPrincipal currentUser) {
        ProjectResponse response = projectService.getProjectById(id, currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Update project", description = "Updates an existing project")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request,
            @CurrentUser UserPrincipal currentUser) {
        ProjectResponse response = projectService.updateProject(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete project", description = "Deletes a project. Requires ADMIN role.")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,
            @CurrentUser UserPrincipal currentUser) {
        projectService.deleteProject(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/tasks")
    @Operation(summary = "Get project tasks", description = "Retrieves paginated and filtered tasks for a project")
    public ResponseEntity<PageResponse<TaskResponse>> getProjectTasks(
            @PathVariable Long id,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @CurrentUser UserPrincipal currentUser) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponse<TaskResponse> response = taskService.getTasksByProject(
                id, status, priority, assignedTo, pageable, currentUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/incidents")
    @Operation(summary = "Get project incidents", description = "Retrieves paginated and filtered incidents for a project")
    public ResponseEntity<PageResponse<IncidentResponse>> getProjectIncidents(
            @PathVariable Long id,
            @RequestParam(required = false) IncidentSeverity severity,
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) Long assignedTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @CurrentUser UserPrincipal currentUser) {

        Sort sort = sortDir.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PageResponse<IncidentResponse> response = incidentService.getIncidentsByProject(
                id, severity, status, assignedTo, pageable, currentUser);
        return ResponseEntity.ok(response);
    }
}

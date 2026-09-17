package com.devflow.controller;

import com.devflow.dto.request.IncidentAssignRequest;
import com.devflow.dto.request.IncidentRequest;
import com.devflow.dto.request.IncidentStatusUpdateRequest;
import com.devflow.dto.response.IncidentResponse;
import com.devflow.security.CurrentUser;
import com.devflow.security.UserPrincipal;
import com.devflow.service.IncidentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@Tag(name = "Incidents", description = "Endpoints for reporting and tracking bugs and incidents")
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    @Operation(summary = "Report incident", description = "Reports a new incident or bug")
    public ResponseEntity<IncidentResponse> createIncident(
            @Valid @RequestBody IncidentRequest request,
            @CurrentUser UserPrincipal currentUser) {
        IncidentResponse response = incidentService.createIncident(request, currentUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get incident by ID", description = "Retrieves incident details by ID")
    public ResponseEntity<IncidentResponse> getIncidentById(
            @PathVariable Long id,
            @CurrentUser UserPrincipal currentUser) {
        IncidentResponse response = incidentService.getIncidentById(id, currentUser);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update incident", description = "Updates an existing incident")
    public ResponseEntity<IncidentResponse> updateIncident(
            @PathVariable Long id,
            @Valid @RequestBody IncidentRequest request,
            @CurrentUser UserPrincipal currentUser) {
        IncidentResponse response = incidentService.updateIncident(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete incident", description = "Deletes an incident")
    public ResponseEntity<Void> deleteIncident(
            @PathVariable Long id,
            @CurrentUser UserPrincipal currentUser) {
        incidentService.deleteIncident(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update incident status", description = "Updates status of an incident")
    public ResponseEntity<IncidentResponse> updateIncidentStatus(
            @PathVariable Long id,
            @Valid @RequestBody IncidentStatusUpdateRequest request,
            @CurrentUser UserPrincipal currentUser) {
        IncidentResponse response = incidentService.updateIncidentStatus(id, request, currentUser);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Assign incident", description = "Assigns an incident to a user")
    public ResponseEntity<IncidentResponse> assignIncident(
            @PathVariable Long id,
            @Valid @RequestBody IncidentAssignRequest request,
            @CurrentUser UserPrincipal currentUser) {
        IncidentResponse response = incidentService.assignIncident(id, request, currentUser);
        return ResponseEntity.ok(response);
    }
}

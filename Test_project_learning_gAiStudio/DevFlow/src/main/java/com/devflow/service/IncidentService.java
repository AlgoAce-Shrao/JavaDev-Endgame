package com.devflow.service;

import com.devflow.dto.request.IncidentAssignRequest;
import com.devflow.dto.request.IncidentRequest;
import com.devflow.dto.request.IncidentStatusUpdateRequest;
import com.devflow.dto.response.IncidentResponse;
import com.devflow.dto.response.PageResponse;
import com.devflow.enums.IncidentSeverity;
import com.devflow.enums.IncidentStatus;
import com.devflow.security.UserPrincipal;
import org.springframework.data.domain.Pageable;

public interface IncidentService {
    IncidentResponse createIncident(IncidentRequest request, UserPrincipal currentUser);
    IncidentResponse getIncidentById(Long id, UserPrincipal currentUser);
    IncidentResponse updateIncident(Long id, IncidentRequest request, UserPrincipal currentUser);
    void deleteIncident(Long id, UserPrincipal currentUser);
    IncidentResponse updateIncidentStatus(Long id, IncidentStatusUpdateRequest request, UserPrincipal currentUser);
    IncidentResponse assignIncident(Long id, IncidentAssignRequest request, UserPrincipal currentUser);
    PageResponse<IncidentResponse> getIncidentsByProject(Long projectId, IncidentSeverity severity, IncidentStatus status, Long assignedToId, Pageable pageable, UserPrincipal currentUser);
}

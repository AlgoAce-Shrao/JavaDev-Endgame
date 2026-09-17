package com.devflow.service.impl;

import com.devflow.dto.request.IncidentAssignRequest;
import com.devflow.dto.request.IncidentRequest;
import com.devflow.dto.request.IncidentStatusUpdateRequest;
import com.devflow.dto.response.IncidentResponse;
import com.devflow.dto.response.PageResponse;
import com.devflow.entity.Incident;
import com.devflow.entity.Project;
import com.devflow.entity.User;
import com.devflow.enums.IncidentSeverity;
import com.devflow.enums.IncidentStatus;
import com.devflow.enums.Role;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.exception.UnauthorizedActionException;
import com.devflow.mapper.EntityMapper;
import com.devflow.repository.IncidentRepository;
import com.devflow.repository.ProjectRepository;
import com.devflow.repository.UserRepository;
import com.devflow.security.UserPrincipal;
import com.devflow.service.IncidentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    @Override
    @Transactional
    public IncidentResponse createIncident(IncidentRequest request, UserPrincipal currentUser) {
        log.info("Reporting incident for project ID: {} by user: {}", request.getProjectId(), currentUser.getId());

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        User reportedBy = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        User assignedTo = null;
        if (request.getAssignedToUserId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedToUserId()));
        }

        Incident incident = Incident.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .severity(request.getSeverity())
                .status(request.getStatus() != null ? request.getStatus() : IncidentStatus.OPEN)
                .project(project)
                .reportedBy(reportedBy)
                .assignedTo(assignedTo)
                .build();

        Incident savedIncident = incidentRepository.save(incident);
        return entityMapper.toIncidentResponse(savedIncident);
    }

    @Override
    @Transactional(readOnly = true)
    public IncidentResponse getIncidentById(Long id, UserPrincipal currentUser) {
        log.info("Fetching incident ID: {} by user: {}", id, currentUser.getId());

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));

        return entityMapper.toIncidentResponse(incident);
    }

    @Override
    @Transactional
    public IncidentResponse updateIncident(Long id, IncidentRequest request, UserPrincipal currentUser) {
        log.info("Updating incident ID: {} by user: {}", id, currentUser.getId());

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));

        incident.setTitle(request.getTitle());
        incident.setDescription(request.getDescription());
        incident.setSeverity(request.getSeverity());

        if (request.getStatus() != null) {
            updateStatusWithTimestamp(incident, request.getStatus());
        }

        if (request.getAssignedToUserId() != null) {
            User assignedTo = userRepository.findById(request.getAssignedToUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedToUserId()));
            incident.setAssignedTo(assignedTo);
        }

        Incident updatedIncident = incidentRepository.save(incident);
        return entityMapper.toIncidentResponse(updatedIncident);
    }

    @Override
    @Transactional
    public void deleteIncident(Long id, UserPrincipal currentUser) {
        log.info("Deleting incident ID: {} by user: {}", id, currentUser.getId());

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));

        if (currentUser.getRole() == Role.DEVELOPER && !incident.getReportedBy().getId().equals(currentUser.getId())) {
            throw new UnauthorizedActionException("Developers can only delete incidents reported by themselves");
        }

        incidentRepository.delete(incident);
    }

    @Override
    @Transactional
    public IncidentResponse updateIncidentStatus(Long id, IncidentStatusUpdateRequest request, UserPrincipal currentUser) {
        log.info("Updating status for incident ID: {} to {} by user: {}", id, request.getStatus(), currentUser.getId());

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));

        updateStatusWithTimestamp(incident, request.getStatus());

        Incident updatedIncident = incidentRepository.save(incident);
        return entityMapper.toIncidentResponse(updatedIncident);
    }

    @Override
    @Transactional
    public IncidentResponse assignIncident(Long id, IncidentAssignRequest request, UserPrincipal currentUser) {
        log.info("Assigning incident ID: {} to user ID: {} by user: {}", id, request.getUserId(), currentUser.getId());

        if (currentUser.getRole() == Role.DEVELOPER) {
            throw new UnauthorizedActionException("Developers are not authorized to assign incidents");
        }

        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));

        User assignedTo = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));

        incident.setAssignedTo(assignedTo);
        Incident updatedIncident = incidentRepository.save(incident);
        return entityMapper.toIncidentResponse(updatedIncident);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<IncidentResponse> getIncidentsByProject(
            Long projectId, IncidentSeverity severity, IncidentStatus status, Long assignedToId, Pageable pageable, UserPrincipal currentUser) {
        log.info("Fetching incidents for project ID: {} with filters - severity: {}, status: {}, assignedTo: {}",
                projectId, severity, status, assignedToId);

        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", "id", projectId);
        }

        Page<Incident> incidentPage = incidentRepository.findIncidentsWithFilters(projectId, severity, status, assignedToId, pageable);
        Page<IncidentResponse> dtoPage = incidentPage.map(entityMapper::toIncidentResponse);

        return PageResponse.fromPage(dtoPage);
    }

    private void updateStatusWithTimestamp(Incident incident, IncidentStatus newStatus) {
        incident.setStatus(newStatus);
        if (newStatus == IncidentStatus.RESOLVED || newStatus == IncidentStatus.CLOSED) {
            if (incident.getResolvedAt() == null) {
                incident.setResolvedAt(LocalDateTime.now());
            }
        } else {
            incident.setResolvedAt(null);
        }
    }
}

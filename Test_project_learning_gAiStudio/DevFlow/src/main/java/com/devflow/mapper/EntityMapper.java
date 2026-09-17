package com.devflow.mapper;

import com.devflow.dto.response.*;
import com.devflow.entity.*;
import org.springframework.stereotype.Component;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public ProjectResponse toProjectResponse(Project project) {
        if (project == null) return null;
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .owner(toUserResponse(project.getOwner()))
                .taskCount(project.getTasks() != null ? project.getTasks().size() : 0)
                .incidentCount(project.getIncidents() != null ? project.getIncidents().size() : 0)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    public TaskResponse toTaskResponse(Task task) {
        if (task == null) return null;
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .projectId(task.getProject() != null ? task.getProject().getId() : null)
                .projectName(task.getProject() != null ? task.getProject().getName() : null)
                .assignedTo(toUserResponse(task.getAssignedTo()))
                .createdBy(toUserResponse(task.getCreatedBy()))
                .commentCount(task.getComments() != null ? task.getComments().size() : 0)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

    public IncidentResponse toIncidentResponse(Incident incident) {
        if (incident == null) return null;
        return IncidentResponse.builder()
                .id(incident.getId())
                .title(incident.getTitle())
                .description(incident.getDescription())
                .severity(incident.getSeverity())
                .status(incident.getStatus())
                .projectId(incident.getProject() != null ? incident.getProject().getId() : null)
                .projectName(incident.getProject() != null ? incident.getProject().getName() : null)
                .reportedBy(toUserResponse(incident.getReportedBy()))
                .assignedTo(toUserResponse(incident.getAssignedTo()))
                .createdAt(incident.getCreatedAt())
                .resolvedAt(incident.getResolvedAt())
                .build();
    }

    public CommentResponse toCommentResponse(Comment comment) {
        if (comment == null) return null;
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(toUserResponse(comment.getAuthor()))
                .taskId(comment.getTask() != null ? comment.getTask().getId() : null)
                .createdAt(comment.getCreatedAt())
                .build();
    }
}

package com.devflow.service;

import com.devflow.dto.request.TaskAssignRequest;
import com.devflow.dto.request.TaskRequest;
import com.devflow.dto.request.TaskStatusUpdateRequest;
import com.devflow.dto.response.PageResponse;
import com.devflow.dto.response.TaskResponse;
import com.devflow.enums.Priority;
import com.devflow.enums.TaskStatus;
import com.devflow.security.UserPrincipal;
import org.springframework.data.domain.Pageable;

public interface TaskService {
    TaskResponse createTask(TaskRequest request, UserPrincipal currentUser);
    TaskResponse getTaskById(Long id, UserPrincipal currentUser);
    TaskResponse updateTask(Long id, TaskRequest request, UserPrincipal currentUser);
    void deleteTask(Long id, UserPrincipal currentUser);
    TaskResponse updateTaskStatus(Long id, TaskStatusUpdateRequest request, UserPrincipal currentUser);
    TaskResponse assignTask(Long id, TaskAssignRequest request, UserPrincipal currentUser);
    PageResponse<TaskResponse> getTasksByProject(Long projectId, TaskStatus status, Priority priority, Long assignedToId, Pageable pageable, UserPrincipal currentUser);
}

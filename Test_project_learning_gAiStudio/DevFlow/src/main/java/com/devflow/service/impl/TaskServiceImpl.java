package com.devflow.service.impl;

import com.devflow.dto.request.TaskAssignRequest;
import com.devflow.dto.request.TaskRequest;
import com.devflow.dto.request.TaskStatusUpdateRequest;
import com.devflow.dto.response.PageResponse;
import com.devflow.dto.response.TaskResponse;
import com.devflow.entity.Project;
import com.devflow.entity.Task;
import com.devflow.entity.User;
import com.devflow.enums.Priority;
import com.devflow.enums.Role;
import com.devflow.enums.TaskStatus;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.exception.UnauthorizedActionException;
import com.devflow.mapper.EntityMapper;
import com.devflow.repository.ProjectRepository;
import com.devflow.repository.TaskRepository;
import com.devflow.repository.UserRepository;
import com.devflow.security.UserPrincipal;
import com.devflow.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request, UserPrincipal currentUser) {
        log.info("Creating task for project ID: {} by user: {}", request.getProjectId(), currentUser.getId());

        if (currentUser.getRole() == Role.DEVELOPER) {
            throw new UnauthorizedActionException("Developers are not authorized to create tasks directly");
        }

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", request.getProjectId()));

        User createdBy = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        User assignedTo = null;
        if (request.getAssignedToUserId() != null) {
            assignedTo = userRepository.findById(request.getAssignedToUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedToUserId()));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .dueDate(request.getDueDate())
                .project(project)
                .createdBy(createdBy)
                .assignedTo(assignedTo)
                .build();

        Task savedTask = taskRepository.save(task);
        return entityMapper.toTaskResponse(savedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id, UserPrincipal currentUser) {
        log.info("Fetching task ID: {} for user: {}", id, currentUser.getId());

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        return entityMapper.toTaskResponse(task);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, UserPrincipal currentUser) {
        log.info("Updating task ID: {} by user: {}", id, currentUser.getId());

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        // Authorization check
        if (currentUser.getRole() == Role.DEVELOPER) {
            if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId())) {
                throw new UnauthorizedActionException("Developers can only update tasks assigned to them");
            }
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        task.setDueDate(request.getDueDate());

        if (request.getAssignedToUserId() != null && currentUser.getRole() != Role.DEVELOPER) {
            User assignedTo = userRepository.findById(request.getAssignedToUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedToUserId()));
            task.setAssignedTo(assignedTo);
        }

        Task updatedTask = taskRepository.save(task);
        return entityMapper.toTaskResponse(updatedTask);
    }

    @Override
    @Transactional
    public void deleteTask(Long id, UserPrincipal currentUser) {
        log.info("Deleting task ID: {} by user: {}", id, currentUser.getId());

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        if (currentUser.getRole() == Role.DEVELOPER) {
            throw new UnauthorizedActionException("Developers cannot delete tasks");
        }

        taskRepository.delete(task);
    }

    @Override
    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatusUpdateRequest request, UserPrincipal currentUser) {
        log.info("Updating status for task ID: {} to {} by user: {}", id, request.getStatus(), currentUser.getId());

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        // Developers can only update status if task is assigned to them
        if (currentUser.getRole() == Role.DEVELOPER) {
            if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(currentUser.getId())) {
                throw new UnauthorizedActionException("You can only update status of tasks assigned to you");
            }
        }

        task.setStatus(request.getStatus());
        Task updatedTask = taskRepository.save(task);
        return entityMapper.toTaskResponse(updatedTask);
    }

    @Override
    @Transactional
    public TaskResponse assignTask(Long id, TaskAssignRequest request, UserPrincipal currentUser) {
        log.info("Assigning task ID: {} to user ID: {} by user: {}", id, request.getUserId(), currentUser.getId());

        if (currentUser.getRole() == Role.DEVELOPER) {
            throw new UnauthorizedActionException("Developers are not authorized to assign tasks");
        }

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        User assignedTo = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getUserId()));

        task.setAssignedTo(assignedTo);
        Task updatedTask = taskRepository.save(task);
        return entityMapper.toTaskResponse(updatedTask);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TaskResponse> getTasksByProject(
            Long projectId, TaskStatus status, Priority priority, Long assignedToId, Pageable pageable, UserPrincipal currentUser) {
        log.info("Fetching tasks for project ID: {} with filters - status: {}, priority: {}, assignedTo: {}",
                projectId, status, priority, assignedToId);

        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", "id", projectId);
        }

        Page<Task> taskPage = taskRepository.findTasksWithFilters(projectId, status, priority, assignedToId, pageable);
        Page<TaskResponse> dtoPage = taskPage.map(entityMapper::toTaskResponse);

        return PageResponse.fromPage(dtoPage);
    }
}

package com.devflow.service;

import com.devflow.dto.request.TaskAssignRequest;
import com.devflow.dto.request.TaskRequest;
import com.devflow.dto.request.TaskStatusUpdateRequest;
import com.devflow.dto.response.TaskResponse;
import com.devflow.entity.Project;
import com.devflow.entity.Task;
import com.devflow.entity.User;
import com.devflow.enums.Priority;
import com.devflow.enums.Role;
import com.devflow.enums.TaskStatus;
import com.devflow.exception.UnauthorizedActionException;
import com.devflow.mapper.EntityMapper;
import com.devflow.repository.ProjectRepository;
import com.devflow.repository.TaskRepository;
import com.devflow.repository.UserRepository;
import com.devflow.security.UserPrincipal;
import com.devflow.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EntityMapper entityMapper;

    @InjectMocks
    private TaskServiceImpl taskService;

    private User managerUser;
    private User devUser;
    private User otherDevUser;
    private UserPrincipal managerPrincipal;
    private UserPrincipal devPrincipal;
    private UserPrincipal otherDevPrincipal;

    private Project sampleProject;
    private Task sampleTask;

    @BeforeEach
    void setUp() {
        managerUser = User.builder().id(1L).name("Manager Bob").email("manager@devflow.com").role(Role.MANAGER).build();
        devUser = User.builder().id(2L).name("Dev Charlie").email("charlie@devflow.com").role(Role.DEVELOPER).build();
        otherDevUser = User.builder().id(3L).name("Dev Diana").email("diana@devflow.com").role(Role.DEVELOPER).build();

        managerPrincipal = UserPrincipal.create(managerUser);
        devPrincipal = UserPrincipal.create(devUser);
        otherDevPrincipal = UserPrincipal.create(otherDevUser);

        sampleProject = Project.builder().id(10L).name("DevFlow Core").owner(managerUser).build();

        sampleTask = Task.builder()
                .id(100L)
                .title("Build Auth Layer")
                .description("Build Spring Security JWT filter")
                .priority(Priority.HIGH)
                .status(TaskStatus.TODO)
                .project(sampleProject)
                .createdBy(managerUser)
                .assignedTo(devUser)
                .build();
    }

    @Test
    @DisplayName("Should successfully assign task when requested by MANAGER")
    void assignTask_Manager_Success() {
        TaskAssignRequest assignRequest = TaskAssignRequest.builder().userId(3L).build();

        when(taskRepository.findById(100L)).thenReturn(Optional.of(sampleTask));
        when(userRepository.findById(3L)).thenReturn(Optional.of(otherDevUser));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);
        when(entityMapper.toTaskResponse(any(Task.class))).thenReturn(TaskResponse.builder().id(100L).title("Build Auth Layer").build());

        TaskResponse response = taskService.assignTask(100L, assignRequest, managerPrincipal);

        assertThat(response).isNotNull();
        verify(taskRepository, times(1)).save(sampleTask);
    }

    @Test
    @DisplayName("Should throw UnauthorizedActionException when DEVELOPER attempts to assign task")
    void assignTask_Developer_ThrowsException() {
        TaskAssignRequest assignRequest = TaskAssignRequest.builder().userId(3L).build();

        assertThatThrownBy(() -> taskService.assignTask(100L, assignRequest, devPrincipal))
                .isInstanceOf(UnauthorizedActionException.class)
                .hasMessageContaining("Developers are not authorized to assign tasks");

        verify(taskRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should allow assigned DEVELOPER to update task status")
    void updateTaskStatus_AssignedDeveloper_Success() {
        TaskStatusUpdateRequest statusRequest = TaskStatusUpdateRequest.builder().status(TaskStatus.IN_PROGRESS).build();

        when(taskRepository.findById(100L)).thenReturn(Optional.of(sampleTask));
        when(taskRepository.save(any(Task.class))).thenReturn(sampleTask);
        when(entityMapper.toTaskResponse(any(Task.class))).thenReturn(TaskResponse.builder().id(100L).status(TaskStatus.IN_PROGRESS).build());

        TaskResponse response = taskService.updateTaskStatus(100L, statusRequest, devPrincipal);

        assertThat(response).isNotNull();
        verify(taskRepository, times(1)).save(sampleTask);
    }

    @Test
    @DisplayName("Should throw UnauthorizedActionException when unassigned DEVELOPER updates task status")
    void updateTaskStatus_UnassignedDeveloper_ThrowsException() {
        TaskStatusUpdateRequest statusRequest = TaskStatusUpdateRequest.builder().status(TaskStatus.IN_PROGRESS).build();

        when(taskRepository.findById(100L)).thenReturn(Optional.of(sampleTask));

        assertThatThrownBy(() -> taskService.updateTaskStatus(100L, statusRequest, otherDevPrincipal))
                .isInstanceOf(UnauthorizedActionException.class)
                .hasMessageContaining("You can only update status of tasks assigned to you");

        verify(taskRepository, never()).save(any());
    }
}

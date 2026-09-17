package com.devflow.service;

import com.devflow.dto.request.ProjectRequest;
import com.devflow.dto.response.ProjectResponse;
import com.devflow.dto.response.UserResponse;
import com.devflow.entity.Project;
import com.devflow.entity.User;
import com.devflow.enums.Role;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.exception.UnauthorizedActionException;
import com.devflow.mapper.EntityMapper;
import com.devflow.repository.ProjectRepository;
import com.devflow.repository.UserRepository;
import com.devflow.security.UserPrincipal;
import com.devflow.service.impl.ProjectServiceImpl;
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
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EntityMapper entityMapper;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private User managerUser;
    private UserPrincipal managerPrincipal;
    private UserPrincipal devPrincipal;
    private Project sampleProject;
    private ProjectRequest projectRequest;
    private ProjectResponse projectResponse;

    @BeforeEach
    void setUp() {
        managerUser = User.builder()
                .id(1L)
                .name("Bob Manager")
                .email("manager@devflow.com")
                .role(Role.MANAGER)
                .build();

        managerPrincipal = UserPrincipal.create(managerUser);

        User devUser = User.builder()
                .id(2L)
                .name("Charlie Dev")
                .email("dev@devflow.com")
                .role(Role.DEVELOPER)
                .build();

        devPrincipal = UserPrincipal.create(devUser);

        sampleProject = Project.builder()
                .id(10L)
                .name("DevFlow Core")
                .description("Core Backend Service")
                .owner(managerUser)
                .build();

        projectRequest = ProjectRequest.builder()
                .name("DevFlow Core")
                .description("Core Backend Service")
                .build();

        projectResponse = ProjectResponse.builder()
                .id(10L)
                .name("DevFlow Core")
                .description("Core Backend Service")
                .owner(UserResponse.builder().id(1L).name("Bob Manager").email("manager@devflow.com").role(Role.MANAGER).build())
                .build();
    }

    @Test
    @DisplayName("Should allow MANAGER role to create project")
    void createProject_Manager_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(managerUser));
        when(projectRepository.save(any(Project.class))).thenReturn(sampleProject);
        when(entityMapper.toProjectResponse(any(Project.class))).thenReturn(projectResponse);

        ProjectResponse response = projectService.createProject(projectRequest, managerPrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("DevFlow Core");
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    @DisplayName("Should prevent DEVELOPER role from creating project")
    void createProject_Developer_ThrowsUnauthorizedException() {
        assertThatThrownBy(() -> projectService.createProject(projectRequest, devPrincipal))
                .isInstanceOf(UnauthorizedActionException.class)
                .hasMessageContaining("Developers are not authorized to create projects");

        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    @DisplayName("Should return project when existing ID is requested")
    void getProjectById_Success() {
        when(projectRepository.findById(10L)).thenReturn(Optional.of(sampleProject));
        when(entityMapper.toProjectResponse(sampleProject)).thenReturn(projectResponse);

        ProjectResponse response = projectService.getProjectById(10L, managerPrincipal);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(10L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when project ID does not exist")
    void getProjectById_NotFound_ThrowsException() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getProjectById(99L, managerPrincipal))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Project not found");
    }
}

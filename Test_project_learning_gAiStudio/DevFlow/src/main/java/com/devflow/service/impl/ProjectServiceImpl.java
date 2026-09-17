package com.devflow.service.impl;

import com.devflow.dto.request.ProjectRequest;
import com.devflow.dto.response.ProjectResponse;
import com.devflow.entity.Project;
import com.devflow.entity.User;
import com.devflow.enums.Role;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.exception.UnauthorizedActionException;
import com.devflow.mapper.EntityMapper;
import com.devflow.repository.ProjectRepository;
import com.devflow.repository.UserRepository;
import com.devflow.security.UserPrincipal;
import com.devflow.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EntityMapper entityMapper;

    @Override
    @Transactional
    public ProjectResponse createProject(ProjectRequest request, UserPrincipal currentUser) {
        log.info("User {} creating new project: {}", currentUser.getId(), request.getName());

        if (currentUser.getRole() == Role.DEVELOPER) {
            throw new UnauthorizedActionException("Developers are not authorized to create projects");
        }

        User owner = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .build();

        Project savedProject = projectRepository.save(project);
        return entityMapper.toProjectResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(UserPrincipal currentUser) {
        log.info("Fetching all projects for user {} with role {}", currentUser.getId(), currentUser.getRole());

        List<Project> projects;
        if (currentUser.getRole() == Role.ADMIN) {
            projects = projectRepository.findAll();
        } else if (currentUser.getRole() == Role.MANAGER) {
            projects = projectRepository.findByOwnerId(currentUser.getId());
        } else { // DEVELOPER
            // Developers can view all projects they are assigned tasks or incidents in, or general projects
            projects = projectRepository.findAll();
        }

        return projects.stream()
                .map(entityMapper::toProjectResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "projects", key = "#id")
    public ProjectResponse getProjectById(Long id, UserPrincipal currentUser) {
        log.info("Fetching project by ID: {} (Cache miss if logged)", id);

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        return entityMapper.toProjectResponse(project);
    }

    @Override
    @Transactional
    @CacheEvict(value = "projects", key = "#id")
    public ProjectResponse updateProject(Long id, ProjectRequest request, UserPrincipal currentUser) {
        log.info("Updating project ID: {} by user {}", id, currentUser.getId());

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        // Check ownership or ADMIN
        if (currentUser.getRole() != Role.ADMIN && !project.getOwner().getId().equals(currentUser.getId())) {
            throw new UnauthorizedActionException("You are not authorized to update this project");
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        return entityMapper.toProjectResponse(updatedProject);
    }

    @Override
    @Transactional
    @CacheEvict(value = "projects", key = "#id")
    public void deleteProject(Long id, UserPrincipal currentUser) {
        log.info("Deleting project ID: {} by user {}", id, currentUser.getId());

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedActionException("Only administrators can delete projects");
        }

        projectRepository.delete(project);
    }
}

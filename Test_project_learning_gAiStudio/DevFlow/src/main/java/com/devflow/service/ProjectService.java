package com.devflow.service;

import com.devflow.dto.request.ProjectRequest;
import com.devflow.dto.response.ProjectResponse;
import com.devflow.security.UserPrincipal;

import java.util.List;

public interface ProjectService {
    ProjectResponse createProject(ProjectRequest request, UserPrincipal currentUser);
    List<ProjectResponse> getAllProjects(UserPrincipal currentUser);
    ProjectResponse getProjectById(Long id, UserPrincipal currentUser);
    ProjectResponse updateProject(Long id, ProjectRequest request, UserPrincipal currentUser);
    void deleteProject(Long id, UserPrincipal currentUser);
}

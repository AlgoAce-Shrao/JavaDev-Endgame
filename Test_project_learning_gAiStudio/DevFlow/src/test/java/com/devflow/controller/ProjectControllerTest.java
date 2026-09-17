package com.devflow.controller;

import com.devflow.dto.request.ProjectRequest;
import com.devflow.dto.response.ProjectResponse;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.security.JwtAuthenticationFilter;
import com.devflow.security.JwtTokenProvider;
import com.devflow.service.IncidentService;
import com.devflow.service.ProjectService;
import com.devflow.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProjectController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProjectService projectService;

    @MockBean
    private TaskService taskService;

    @MockBean
    private IncidentService incidentService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @DisplayName("GET /api/projects/{id} should return 200 OK when project exists")
    void getProjectById_Success() throws Exception {
        ProjectResponse response = ProjectResponse.builder()
                .id(1L)
                .name("DevFlow Core")
                .description("Developer Management Platform")
                .build();

        when(projectService.getProjectById(eq(1L), any())).thenReturn(response);

        mockMvc.perform(get("/api/projects/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("DevFlow Core"));
    }

    @Test
    @DisplayName("GET /api/projects/{id} should return 404 Not Found when project does not exist")
    void getProjectById_NotFound() throws Exception {
        when(projectService.getProjectById(eq(99L), any()))
                .thenThrow(new ResourceNotFoundException("Project", "id", 99L));

        mockMvc.perform(get("/api/projects/99")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Project not found with id: '99'"));
    }
}

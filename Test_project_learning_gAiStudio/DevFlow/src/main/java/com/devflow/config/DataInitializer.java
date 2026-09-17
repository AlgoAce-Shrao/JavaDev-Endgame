package com.devflow.config;

import com.devflow.entity.Comment;
import com.devflow.entity.Incident;
import com.devflow.entity.Project;
import com.devflow.entity.Task;
import com.devflow.entity.User;
import com.devflow.enums.IncidentSeverity;
import com.devflow.enums.IncidentStatus;
import com.devflow.enums.Priority;
import com.devflow.enums.Role;
import com.devflow.enums.TaskStatus;
import com.devflow.repository.CommentRepository;
import com.devflow.repository.IncidentRepository;
import com.devflow.repository.ProjectRepository;
import com.devflow.repository.TaskRepository;
import com.devflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final IncidentRepository incidentRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Development database already contains data. Skipping sample data initialization.");
            return;
        }

        log.info("Initializing sample development data for DevFlow platform...");

        // Sample Passwords (DEVELOPMENT ONLY)
        String devPassword = passwordEncoder.encode("Password123!");

        // 1. Users
        User admin = User.builder()
                .name("Alice Admin")
                .email("admin@devflow.com")
                .password(devPassword)
                .role(Role.ADMIN)
                .build();

        User manager = User.builder()
                .name("Bob Manager")
                .email("manager@devflow.com")
                .password(devPassword)
                .role(Role.MANAGER)
                .build();

        User dev1 = User.builder()
                .name("Charlie Dev")
                .email("charlie@devflow.com")
                .password(devPassword)
                .role(Role.DEVELOPER)
                .build();

        User dev2 = User.builder()
                .name("Diana Dev")
                .email("diana@devflow.com")
                .password(devPassword)
                .role(Role.DEVELOPER)
                .build();

        userRepository.save(admin);
        userRepository.save(manager);
        userRepository.save(dev1);
        userRepository.save(dev2);

        // 2. Projects
        Project project1 = Project.builder()
                .name("Cloud Portal Migration")
                .description("Migrating core legacy monolith services to Cloud Native Microservices architecture")
                .owner(manager)
                .build();

        Project project2 = Project.builder()
                .name("Mobile SDK Integration")
                .description("Building cross-platform authentication and analytics SDK for iOS and Android")
                .owner(admin)
                .build();

        projectRepository.save(project1);
        projectRepository.save(project2);

        // 3. Tasks
        Task task1 = Task.builder()
                .title("Design Database Schema for Auth Service")
                .description("Create PostgreSQL ERD and JPA entity mappings with Flyway migrations")
                .priority(Priority.HIGH)
                .status(TaskStatus.DONE)
                .dueDate(LocalDateTime.now().plusDays(3))
                .project(project1)
                .createdBy(manager)
                .assignedTo(dev1)
                .build();

        Task task2 = Task.builder()
                .title("Implement JWT Refresh Token Mechanism")
                .description("Add Redis-backed refresh token rotation and session revocation support")
                .priority(Priority.CRITICAL)
                .status(TaskStatus.IN_PROGRESS)
                .dueDate(LocalDateTime.now().plusDays(5))
                .project(project1)
                .createdBy(manager)
                .assignedTo(dev1)
                .build();

        Task task3 = Task.builder()
                .title("Setup CI/CD Pipeline on GitHub Actions")
                .description("Configure automated build, test execution, and Docker image publishing")
                .priority(Priority.MEDIUM)
                .status(TaskStatus.TODO)
                .dueDate(LocalDateTime.now().plusDays(7))
                .project(project2)
                .createdBy(admin)
                .assignedTo(dev2)
                .build();

        taskRepository.save(task1);
        taskRepository.save(task2);
        taskRepository.save(task3);

        // 4. Incidents
        Incident incident1 = Incident.builder()
                .title("High Latency on JWT Validation Endpoint")
                .description("Cache misses in Redis causing connection pool exhaustion during peak hours")
                .severity(IncidentSeverity.HIGH)
                .status(IncidentStatus.INVESTIGATING)
                .project(project1)
                .reportedBy(dev2)
                .assignedTo(dev1)
                .build();

        Incident incident2 = Incident.builder()
                .title("OAuth Redirect URL Parsing Failure")
                .description("Special characters in state parameter cause 400 Bad Request on callback")
                .severity(IncidentSeverity.MEDIUM)
                .status(IncidentStatus.OPEN)
                .project(project2)
                .reportedBy(dev1)
                .assignedTo(dev2)
                .build();

        incidentRepository.save(incident1);
        incidentRepository.save(incident2);

        // 5. Comments
        Comment comment1 = Comment.builder()
                .content("I have identified the slow query in the execution plan. Applying index fixes now.")
                .author(dev1)
                .task(task2)
                .build();

        Comment comment2 = Comment.builder()
                .content("Great progress! Make sure to run performance benchmarks before merging.")
                .author(manager)
                .task(task2)
                .build();

        commentRepository.save(comment1);
        commentRepository.save(comment2);

        log.info("Sample development data initialized successfully!");
        log.info("Default Development Accounts (Password: Password123!):");
        log.info(" - ADMIN: admin@devflow.com");
        log.info(" - MANAGER: manager@devflow.com");
        log.info(" - DEVELOPERS: charlie@devflow.com, diana@devflow.com");
    }
}

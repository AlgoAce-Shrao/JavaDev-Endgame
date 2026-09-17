package com.devflow.repository;

import com.devflow.entity.Task;
import com.devflow.enums.Priority;
import com.devflow.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    List<Task> findByProjectId(Long projectId);

    Page<Task> findByProjectId(Long projectId, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.project.id = :projectId " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:assignedToId IS NULL OR t.assignedTo.id = :assignedToId)")
    Page<Task> findTasksWithFilters(
            @Param("projectId") Long projectId,
            @Param("status") TaskStatus status,
            @Param("priority") Priority priority,
            @Param("assignedToId") Long assignedToId,
            Pageable pageable
    );
}

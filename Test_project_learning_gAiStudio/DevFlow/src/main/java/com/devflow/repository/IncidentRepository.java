package com.devflow.repository;

import com.devflow.entity.Incident;
import com.devflow.enums.IncidentSeverity;
import com.devflow.enums.IncidentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long>, JpaSpecificationExecutor<Incident> {

    List<Incident> findByProjectId(Long projectId);

    Page<Incident> findByProjectId(Long projectId, Pageable pageable);

    @Query("SELECT i FROM Incident i WHERE i.project.id = :projectId " +
           "AND (:severity IS NULL OR i.severity = :severity) " +
           "AND (:status IS NULL OR i.status = :status) " +
           "AND (:assignedToId IS NULL OR i.assignedTo.id = :assignedToId)")
    Page<Incident> findIncidentsWithFilters(
            @Param("projectId") Long projectId,
            @Param("severity") IncidentSeverity severity,
            @Param("status") IncidentStatus status,
            @Param("assignedToId") Long assignedToId,
            Pageable pageable
    );
}

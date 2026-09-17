package com.SpringDataJPADemo.HospitalManagementSystem.repository;

import com.SpringDataJPADemo.HospitalManagementSystem.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
}
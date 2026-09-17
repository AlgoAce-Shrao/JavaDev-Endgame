package com.SpringDataJPADemo.HospitalManagementSystem.dto;

import com.SpringDataJPADemo.HospitalManagementSystem.entity.type.BloodGroupType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PatientResponseDTO {

    private Long id;
    private String name;
    private LocalDateTime birthDate;
    private String email;
    private BloodGroupType bloodGroupType;
}

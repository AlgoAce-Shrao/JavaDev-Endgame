package com.SpringDataJPADemo.HospitalManagementSystem.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentResponseDTO {

    private Long id;
    private LocalDateTime appointmentTime;
    private String reason;
    private DoctorResponseDTO doctor;
}

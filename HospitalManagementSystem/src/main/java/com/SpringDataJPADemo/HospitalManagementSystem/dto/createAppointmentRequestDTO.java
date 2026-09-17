package com.SpringDataJPADemo.HospitalManagementSystem.dto;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class createAppointmentRequestDTO {

    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentTime;
    private String reason;

}

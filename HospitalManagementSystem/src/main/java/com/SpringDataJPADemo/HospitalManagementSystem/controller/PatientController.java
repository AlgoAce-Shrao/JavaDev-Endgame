package com.SpringDataJPADemo.HospitalManagementSystem.controller;

import com.SpringDataJPADemo.HospitalManagementSystem.dto.AppointmentResponseDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.dto.PatientResponseDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.dto.createAppointmentRequestDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.service.AppointmentService;
import com.SpringDataJPADemo.HospitalManagementSystem.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final AppointmentService appointmentService;
    private final PatientService patientService;

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentResponseDTO> createAppointment(@RequestBody createAppointmentRequestDTO createAppointmentRequestDTO){
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createNewAppointment(createAppointmentRequestDTO));
    }

    @GetMapping("/profile")
    public ResponseEntity<PatientResponseDTO> getPatientProfile(){
        Long patientId=4L;
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }
}

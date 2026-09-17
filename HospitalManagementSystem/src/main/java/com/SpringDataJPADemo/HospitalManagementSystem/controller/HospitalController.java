package com.SpringDataJPADemo.HospitalManagementSystem.controller;

import com.SpringDataJPADemo.HospitalManagementSystem.dto.DoctorResponseDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.Doctor;
import com.SpringDataJPADemo.HospitalManagementSystem.service.DoctorService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public")
public class HospitalController {

    private final DoctorService doctorService;

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponseDTO>> getAllDoctors(){
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

}

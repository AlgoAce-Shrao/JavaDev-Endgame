package com.SpringDataJPADemo.HospitalManagementSystem.service;

import com.SpringDataJPADemo.HospitalManagementSystem.dto.DoctorResponseDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.Doctor;
import com.SpringDataJPADemo.HospitalManagementSystem.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {


    private final DoctorRepository doctorRepository;
    private final ModelMapper modelMapper;

    public List<DoctorResponseDTO> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(doctor ->modelMapper.map(doctor,DoctorResponseDTO.class) )
                .collect(Collectors.toList());

    }
}

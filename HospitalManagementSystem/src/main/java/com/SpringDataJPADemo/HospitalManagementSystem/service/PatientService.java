package com.SpringDataJPADemo.HospitalManagementSystem.service;

import com.SpringDataJPADemo.HospitalManagementSystem.dto.PatientResponseDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.Patient;
import com.SpringDataJPADemo.HospitalManagementSystem.repository.PatientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Comment;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;

//    @Transactional
//    public Patient getPatientById(Long id) {
//
//        Patient p1 = patientRepository.findById(id).orElseThrow();
//
//        Patient p2 = patientRepository.findById(id).orElseThrow();
//
//
//        /*
//         * Without @Transactional:
//         * Each repository call gets its own Persistence Context.
//         * Therefore both findById() calls hit the database.
//         *
//         * With @Transactional:
//         * A single Persistence Context is shared throughout this method.
//         *
//         * During the first findById():
//         * - Hibernate executes a SQL query.
//         * - The entity is loaded into the Persistence Context.
//         *
//         * During the second findById():
//         * - Hibernate first checks the Persistence Context.
//         * - Since the entity is already present, it returns the same managed entity.
//         * - No additional SQL query is executed.
//         *
//         * Thus, the Persistence Context acts as Hibernate's First-Level Cache.
//         */
//
//        System.out.println(p1 == p2); // true
//
//        p1.setName("Udita");
//
//        /*
//         * The entity is currently in the Managed (Persistent) state.
//         *
//         * Since it is managed by the Persistence Context,
//         * Hibernate tracks changes made to it.
//         *
//         * When the transaction is flushed/committed:
//         * - Hibernate performs Dirty Checking.
//         * - It compares the current entity state with its original snapshot.
//         * - If changes are detected, Hibernate automatically generates
//         *   and executes the required UPDATE query.
//         *
//         * Therefore, calling save() is not necessary here.
//         */
//
//        //for more info: https://chatgpt.com/share/6a266f8d-2970-8321-937a-b15998bb5bb7
//
//        return p1;
//    }

    @Transactional
    public PatientResponseDTO getPatientById(Long patientId) {
        Patient patient=patientRepository.findById(patientId)
                .orElseThrow(()->new IllegalArgumentException("Patient not found!"));

        return modelMapper.map(patient, PatientResponseDTO.class);
    }


    public List<PatientResponseDTO> getAllPatients(Integer pageNumber,Integer pageSize){
        return patientRepository.findAll(PageRequest.of(pageNumber,pageSize))
                .stream()
                .map(patient -> modelMapper.map(patient,PatientResponseDTO.class))
                .collect(Collectors.toList());

    }
}

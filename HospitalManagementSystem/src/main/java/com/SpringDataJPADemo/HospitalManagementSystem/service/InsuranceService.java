package com.SpringDataJPADemo.HospitalManagementSystem.service;

import com.SpringDataJPADemo.HospitalManagementSystem.entity.Insurance;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.Patient;
import com.SpringDataJPADemo.HospitalManagementSystem.repository.InsuranceRepository;
import com.SpringDataJPADemo.HospitalManagementSystem.repository.PatientRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InsuranceService {

    private final InsuranceRepository insuranceRepository;
    private final PatientRepository patientRepository;


    @Modifying
    @Transactional
    public Patient assignInsuranceToPatient(Insurance insurance,Long id){
        Patient patient=patientRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Patient not found"));

        patient.setInsurance(insurance);

//        insurance.setPatient(patient);

        return patient;
    }

    @Modifying
    @Transactional
    public Patient   disassociateInsuranceFromPatient(Long patientId){
        Patient patient=patientRepository.findById(patientId)
                .orElseThrow(()-> new EntityNotFoundException("Patient not found"));

        patient.setInsurance(null);   //bas done...dirty checking --> insurance is orphan...cuz here it is deleted so in db that insurance is not connected to the patient..so will be removed

        return patient;
    }
}

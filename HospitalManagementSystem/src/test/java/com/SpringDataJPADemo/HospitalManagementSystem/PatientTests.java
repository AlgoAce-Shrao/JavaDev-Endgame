package com.SpringDataJPADemo.HospitalManagementSystem;

import com.SpringDataJPADemo.HospitalManagementSystem.dto.BloodGroupCountResponseDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.Patient;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.type.BloodGroupType;
import com.SpringDataJPADemo.HospitalManagementSystem.repository.PatientRepository;
import com.SpringDataJPADemo.HospitalManagementSystem.service.PatientService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;

@SpringBootTest
public class PatientTests {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PatientService patientService;

    @Test
    public void testPatientRepository(){
        List<Patient> patientList=patientRepository.findAllPatientWithappointment();

        for(Patient p:patientList){
            System.out.println(p);
        }
    }

//    @Test
//    public void testTransactionMethods(){
//        Patient p1=patientService.getPatientById(1L);
//
//        System.out.println(p1);
//    }

    @Test
    public void testgetPatientByName(){
        Patient patient=patientRepository.findByName("Diya Patel");

        System.out.println(patient);
    }

    @Test
    public void testgetPatientByBirthDate(){
        Patient patient=patientRepository.findByBirthDate(LocalDateTime.of(1992, 12, 1,00,00,00,000));

        System.out.println(patient);
    }

    @Test
    public void testgetPatientByNameOrBirthDate(){
        List<Patient> patient =patientRepository.findByNameOrBirthDate("Kabir Singh",LocalDateTime.of(1992, 12, 1,00,00,00,000));

        System.out.println(patient);
    }

    @Test
    public void testgetPatientByNameAndBirthDate(){
        List<Patient> patient =patientRepository.findByNameAndBirthDate("Kabir Singh",LocalDateTime.of(1993, 7, 11,00,00,00,000));

        System.out.println(patient);
    }

    @Test
    public void testgetPatientByBloodGroup(){
        List<Patient> patient=patientRepository.findByBloodGroup(BloodGroupType.A_POSITIVE);

        for(Patient p:patient){
            System.out.println(p);

        }


    }

    @Test
    public void testgetPatientByBirthDateAfter(){
        List<Patient> patient=patientRepository.findByBirthDateAfter(LocalDateTime.of(1992, 12, 1,00,00,00,000));


        for(Patient p:patient){
            System.out.println(p);

        }
    }

    @Test
    public void testgetPatientBloodGroupCount(){
        List<BloodGroupCountResponseDTO> patientList=patientRepository.countEachBloodGroupType();

        for(BloodGroupCountResponseDTO bloodGroupCountResponseDTO:patientList){
            System.out.println(bloodGroupCountResponseDTO);
        }
    }

    @Test
    public void testGetAllPatients(){
        Page<Patient> patientList=patientRepository.findAllPatients(PageRequest.of(0,2,Sort.by(Sort.Direction.DESC,"name")));

        for(Patient p:patientList){
            System.out.println(p);

        }

        System.out.println(patientList.getTotalPages());

    }

    @Test
    public void testUpdatePatient(){
        int rowsUpdated=patientRepository.updateById(1L,"Arav");

        System.out.println("rows updated: "+rowsUpdated);
    }


}


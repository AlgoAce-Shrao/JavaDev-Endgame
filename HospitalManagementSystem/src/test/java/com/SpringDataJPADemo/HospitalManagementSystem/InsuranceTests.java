package com.SpringDataJPADemo.HospitalManagementSystem;

import com.SpringDataJPADemo.HospitalManagementSystem.entity.Insurance;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.Patient;
import com.SpringDataJPADemo.HospitalManagementSystem.service.InsuranceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

@SpringBootTest
public class InsuranceTests {
    @Autowired
    private InsuranceService insuranceService;

    @Test
    public void testInsurance(){
        Insurance insurance=Insurance.builder()
                .policyNumber("HDFC-1234")
                .provider("HDFC")
                .validUntil(LocalDate.of(2030,12,12))
                .build();

        Patient patient =insuranceService.assignInsuranceToPatient(insurance,1L);
        System.out.println(patient);
    }

    @Test
    public void testDissociateInsurance(){
        Patient updatedPatient=insuranceService.disassociateInsuranceFromPatient(1L);

        System.out.println(updatedPatient);

    }
}

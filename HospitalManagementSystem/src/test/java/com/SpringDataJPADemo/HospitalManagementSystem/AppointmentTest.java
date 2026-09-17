package com.SpringDataJPADemo.HospitalManagementSystem;

import com.SpringDataJPADemo.HospitalManagementSystem.entity.Appointment;
import com.SpringDataJPADemo.HospitalManagementSystem.service.AppointmentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

@SpringBootTest
public class AppointmentTest {

    @Autowired
    private AppointmentService appointmentService;

//    @Test
//    public void testCreateAppointment() {
//        Appointment appointment= Appointment
//                                .builder()
//                                .appointmentTime(LocalDateTime.of(2025,6,10,11,48))
//                                .reason("Gastrointestinal problems")
//                                .build();
//
//        var newAppointment=appointmentService.createNewAppointment(appointment,1L,2L);
//
//        System.out.println(newAppointment);
//    }

    @Test
    public void testReassignDoctorToAppointment(){
        Appointment updatedAppointment=appointmentService.reassignDoctorToAppointment(1L,2L);

        System.out.println(updatedAppointment);
    }
}

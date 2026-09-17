package com.SpringDataJPADemo.HospitalManagementSystem.service;

import com.SpringDataJPADemo.HospitalManagementSystem.dto.AppointmentResponseDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.dto.createAppointmentRequestDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.Appointment;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.Doctor;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.Patient;
import com.SpringDataJPADemo.HospitalManagementSystem.repository.AppointmentRepository;
import com.SpringDataJPADemo.HospitalManagementSystem.repository.DoctorRepository;
import com.SpringDataJPADemo.HospitalManagementSystem.repository.PatientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public AppointmentResponseDTO createNewAppointment(createAppointmentRequestDTO createAppointmentRequestDTO){



//        Patient patient=patientRepository.findById(patientId).orElseThrow(()->new IllegalArgumentException("Patient not found"));
//        Doctor doctor=doctorRepository.findById(doctorId).orElseThrow(()->new IllegalArgumentException("Doctor not found"));
//
//        if(appointment.getId()!=null) throw new IllegalArgumentException("Äppointment should not have been present");
//
//        appointment.setPatient(patient);
//        appointment.setDoctor(doctor);
//
//        //To maintain bidirectional consistency...
//        patient.getAppointments().add(appointment);
//
//
//
//        return appointmentRepository.save(appointment);

        Patient patient=patientRepository.findById(createAppointmentRequestDTO.getPatientId()).orElseThrow(()->new IllegalArgumentException("Patient Not Found"));
        Doctor doctor=doctorRepository.findById(createAppointmentRequestDTO.getDoctorId()).orElseThrow(()->new IllegalArgumentException("Doctor Not Found"));

        Appointment appointment=Appointment.builder()
                .appointmentTime(createAppointmentRequestDTO.getAppointmentTime())
                .reason(createAppointmentRequestDTO.getReason())
                .build();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        patient.getAppointments().add(appointment); //just to maintain bidirectional consistency

        Appointment saved = appointmentRepository.save(appointment);

        return modelMapper.map(saved, AppointmentResponseDTO.class);

    }


    @Transactional
    public Appointment reassignDoctorToAppointment(Long appointmentId,Long doctorId){
        Appointment appointment=appointmentRepository.findById(appointmentId).orElseThrow(()->new IllegalArgumentException("Appointment not found"));

        Doctor doctor=doctorRepository.findById(doctorId).orElseThrow(()->new IllegalArgumentException("Doctor not found"));

        appointment.setDoctor(doctor);  //this will automatically call the update, beacuase it is dirty and it is a managed entity(due to findbyId)

        doctor.getAppointments().add(appointment); //just for maintaining bidirectional consistency


        return appointment;
    }

    public List<AppointmentResponseDTO> getAllAppointmentsOfDoctor(Long doctorId) {
        Doctor doctor=doctorRepository.findById(doctorId).orElseThrow(()->new IllegalArgumentException("Doctor not found"));

        return doctor.getAppointments()
                .stream()
                .map(appointment -> modelMapper.map(appointment,AppointmentResponseDTO.class))
                .collect(Collectors.toList());
    }
}
package com.SpringDataJPADemo.HospitalManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;
//import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;


@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime appointmentTime;

    @Column(length = 500)
    private String reason;

    @ManyToOne    //Question urself first: If an appointment is deleted, do we want the patient also to get deleted? no ryt...cuz a patient can have other appointments as well..💡and in manytoone we rarely do cascading
    @JoinColumn(name = "patient_id", nullable = false) // patient is required and not nullable
    @ToString.Exclude
    private Patient patient;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(nullable = false)
    private Doctor doctor;
}

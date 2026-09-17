package com.SpringDataJPADemo.HospitalManagementSystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @OneToOne
//    @MapsId
//    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String specialization;

    @Column(nullable = false, unique = true, length = 100)
    private String email;



    @ManyToMany(mappedBy = "doctors")
    @ToString.Exclude
    private Set<Department> department =new HashSet<>();

    @OneToMany(mappedBy = "doctor")
    @ToString.Exclude
    private List<Appointment> appointments=new ArrayList<>();
}
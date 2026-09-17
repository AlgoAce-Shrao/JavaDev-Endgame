package com.SpringDataJPADemo.HospitalManagementSystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @OneToOne
    private Doctor headDoctor;

    @ManyToOne
    @JoinTable(
            name="my_department_doctors",
            joinColumns = @JoinColumn(name="dpt_id"),
            inverseJoinColumns = @JoinColumn(name="doctor_id")
    )
    private Set<Doctor> doctors=new HashSet<>();
}

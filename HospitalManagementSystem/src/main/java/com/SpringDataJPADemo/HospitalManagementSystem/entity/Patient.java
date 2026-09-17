package com.SpringDataJPADemo.HospitalManagementSystem.entity;

import com.SpringDataJPADemo.HospitalManagementSystem.entity.type.BloodGroupType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Fetch;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@AllArgsConstructor
@Table(
        name="patient_tbl",
        uniqueConstraints = {
                @UniqueConstraint(name="unique_patient_email",columnNames = {"email"}),
                @UniqueConstraint(name="unique_patient_name_birthDate",columnNames = {"name","birthDate"})
        },
        indexes = {
            @Index(name="idx_patient_birthDate",columnList = "birthDate")
        }
        //used to make data retrieval faster ..cuz we are making a column as an index so searching becomes faster from O[n] to O[log n]
        //It also consumes data more
        //but insert operation becomes slower cuz now index will be also be added corr. to the data we enter

)
@Builder
public class    Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, length = 40)
    private String name;


    private String gender;

    private LocalDateTime birthDate;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private BloodGroupType bloodGroup;

    @CreationTimestamp
    private LocalDateTime createdAt;


    @OneToOne(cascade = {CascadeType.ALL},orphanRemoval = true)
    @JoinColumn(name = "patient_insurance_id")
    private Insurance insurance;    //owning side

    @OneToMany(mappedBy = "patient", cascade = {CascadeType.REMOVE}, orphanRemoval = true, fetch =FetchType.LAZY)
    @ToString.Exclude
    private List<Appointment> appointments = new ArrayList<>();
    //here patient table has no idea regarding appointment table but if jpa hits the query find patient by appointment it will give the results...--> hence bidirectional flow of info is maintained and also by maintaining single source of truth


    //Regarding orphanremoval:
//    When an Appointment is removed from a Patient's appointment collection, Hibernate detects during flush that the Appointment no longer belongs to any Patient. Since orphanRemoval=true, the Appointment becomes an orphan entity and Hibernate automatically deletes its corresponding row from the database. This happens even though the Patient itself is not deleted.
}
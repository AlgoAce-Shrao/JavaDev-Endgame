package com.SpringDataJPADemo.HospitalManagementSystem.repository;

import com.SpringDataJPADemo.HospitalManagementSystem.dto.BloodGroupCountResponseDTO;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.Patient;
import com.SpringDataJPADemo.HospitalManagementSystem.entity.type.BloodGroupType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Repository
public interface PatientRepository extends JpaRepository<Patient,Long> {
    Patient findByName(String name);

    Patient findByBirthDate(LocalDateTime birthDate);

    List<Patient> findByNameOrBirthDate(String name, LocalDateTime birthDate);
    List<Patient> findByNameAndBirthDate(String name, LocalDateTime birthDate);

    List<Patient> findByBirthDateBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT p FROM Patient p where p.bloodGroup = :bloodGroup")
    List<Patient> findByBloodGroup(@Param("bloodGroup") BloodGroupType bloodGroup);


    @Query("SELECT p FROM Patient p where p.birthDate >:birthDate")
    List<Patient> findByBirthDateAfter(@Param("birthDate") LocalDateTime date);

    @Query("SELECT new com.SpringDataJPADemo.HospitalManagementSystem.dto.BloodGroupCountResponseDTO( p.bloodGroup,count(*)) FROM Patient p group by p.bloodGroup")
    List<BloodGroupCountResponseDTO> countEachBloodGroupType();

    @Query(value = "select * from patient_tbl ",nativeQuery = true)
    Page<Patient> findAllPatients(Pageable pageable);


    @Modifying
    @Transactional
//    @Query(value = "UPDATE patient_tbl SET name = :name WHERE id = :id", nativeQuery = true)
    @Query("UPDATE Patient p SET p.name=:name where id=:id")
    int updateById(@Param("id") Long id, @Param("name") String name);

    @Query("SELECT p from Patient p LEFT JOIN FETCH p.appointments a LEFT JOIN FETCH a.doctor")
    List<Patient> findAllPatientWithappointment();

}


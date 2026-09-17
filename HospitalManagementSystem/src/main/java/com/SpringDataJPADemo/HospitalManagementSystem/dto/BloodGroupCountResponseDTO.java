package com.SpringDataJPADemo.HospitalManagementSystem.dto;

import com.SpringDataJPADemo.HospitalManagementSystem.entity.type.BloodGroupType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class BloodGroupCountResponseDTO {

    private BloodGroupType bloodGroupType;

    private Long count;

}

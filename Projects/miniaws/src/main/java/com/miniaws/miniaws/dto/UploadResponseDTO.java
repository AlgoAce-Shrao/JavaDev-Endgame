package com.miniaws.miniaws.dto;

import lombok.Data;

@Data
public class UploadResponseDTO {

    private Long id;
    private String originalFilename;
    private String storedFilename;
    private Long bucketId;
}

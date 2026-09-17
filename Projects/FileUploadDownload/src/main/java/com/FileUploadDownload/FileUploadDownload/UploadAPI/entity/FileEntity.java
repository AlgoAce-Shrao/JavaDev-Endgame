package com.FileUploadDownload.FileUploadDownload.UploadAPI.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.nio.file.Path;
import java.time.LocalDateTime;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
public class FileEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private long id;


    private String filename;

    private String contentType;

    @CreationTimestamp
    private LocalDateTime createdAt;


    private String uploadPath;
}


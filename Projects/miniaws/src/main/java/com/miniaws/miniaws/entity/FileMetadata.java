package com.miniaws.miniaws.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String originalFilename;

    @Column(nullable=false,updatable = false)
    private String storedFilename;

    private Long size;

    private String contentType;

    private String path;

    @ManyToOne
    @JoinColumn(name = "bucket_id")
    private Bucket bucket;  //owning side

    @CreationTimestamp
    private LocalDateTime uploadedAt;


}

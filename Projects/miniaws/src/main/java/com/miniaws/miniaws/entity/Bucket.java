package com.miniaws.miniaws.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Bucket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,unique = true,updatable = false)
    private String bucketName;

    private String  bucketPath;

//    private Long  ownerId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "bucket",fetch = FetchType.EAGER,cascade = CascadeType.ALL,orphanRemoval = true)
    private List<FileMetadata> listOfFiles;  //inverse side
}

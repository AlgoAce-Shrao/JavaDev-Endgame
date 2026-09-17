package com.miniaws.miniaws.repository;

import com.miniaws.miniaws.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileMetadata,Long> {

    @Query("""
    SELECT f
    FROM FileMetadata f
    WHERE f.bucket.bucketName = :bucketName
      AND f.originalFilename = :originalFilename
""")
    Optional<FileMetadata> findByBucket_BucketNameAndOriginalFilename(@Param("bucketName") String bucketName, @Param("originalFilename") String originalFileName);
}

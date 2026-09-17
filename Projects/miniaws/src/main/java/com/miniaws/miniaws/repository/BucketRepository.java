package com.miniaws.miniaws.repository;

import com.miniaws.miniaws.entity.Bucket;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BucketRepository extends JpaRepository<Bucket, Long> {

    Bucket save(@NonNull Bucket newBucket);

//    @Query("SELECT Bucket b from ")
    Optional<Bucket> findByBucketName(String bucketName);
}

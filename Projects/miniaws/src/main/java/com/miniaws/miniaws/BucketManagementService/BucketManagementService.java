package com.miniaws.miniaws.BucketManagementService;


import com.miniaws.miniaws.entity.Bucket;

public interface BucketManagementService {
    Bucket createBucket(String bucketName);
}

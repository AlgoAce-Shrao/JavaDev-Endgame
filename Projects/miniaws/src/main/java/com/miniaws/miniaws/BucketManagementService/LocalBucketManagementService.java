package com.miniaws.miniaws.BucketManagementService;

import com.miniaws.miniaws.entity.Bucket;
import com.miniaws.miniaws.repository.BucketRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
@RequiredArgsConstructor
public class    LocalBucketManagementService implements BucketManagementService {

    private static final Logger logger = LoggerFactory.getLogger(LocalBucketManagementService.class);
    private static final String SAFE_BUCKET_NAME_PATTERN = "^[a-zA-Z0-9_-]+$";

    @Value("${file.upload-dir}")
    private Path uploadDirectory;

    private final BucketRepository bucketRepository;

    private void validateBucketName(String bucketName) {
        if (bucketName == null || bucketName.trim().isEmpty()) {
            throw new IllegalArgumentException("Bucket name cannot be null or empty");
        }

        if (!bucketName.matches(SAFE_BUCKET_NAME_PATTERN)) {
            throw new IllegalArgumentException(
                "Bucket name can only contain alphanumeric characters, hyphens, and underscores");
        }

        // Ensure the resolved path is still within the upload directory
        Path targetPath = uploadDirectory.resolve(bucketName).normalize();
        if (!targetPath.startsWith(uploadDirectory.normalize())) {
            throw new IllegalArgumentException("Invalid bucket name: path traversal detected");
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public Bucket createBucket(String bucketName) {
        // Validate first (before any side effects)
            validateBucketName(bucketName);
            Path targetPath = uploadDirectory.resolve(bucketName).normalize();

            // Create directory
            try {

                if(Files.exists(targetPath)){
                    throw new BucketCreationException(
                            "Bucket already exists"
                    );
                }

                Files.createDirectory(targetPath);
            }catch(FileAlreadyExistsException e) {
                logger.warn("Bucket of the same name already exists: {}", bucketName);
                throw new BucketCreationException("Bucket already exists: " + bucketName, e);
            }catch (IOException e) {
                logger.error("Failed to create bucket directory: {}", targetPath, e);
                throw new BucketCreationException("Failed to create bucket directory", e);
            }

            // Create database record
            try {
                Bucket newBucket = Bucket.builder()
                        .bucketName(bucketName)
                        .bucketPath(targetPath.toString())
                        .build();
                return bucketRepository.save(newBucket);
            } catch (Exception e) {
                logger.error("Failed to save bucket to database: {}", bucketName, e);
                // Attempt cleanup
                try {
                    Files.deleteIfExists(targetPath);
                } catch (IOException cleanupError) {
                    logger.error("Failed to cleanup bucket directory after DB error: {}", 
                        targetPath, cleanupError);
                }
                throw new BucketCreationException("Failed to create bucket", e);
            }
    }
}

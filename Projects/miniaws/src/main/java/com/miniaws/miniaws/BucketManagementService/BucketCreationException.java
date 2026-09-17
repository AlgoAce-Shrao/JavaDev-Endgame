package com.miniaws.miniaws.BucketManagementService;

public class BucketCreationException extends RuntimeException {
    
    public BucketCreationException(String message) {
        super(message);
    }
    
    public BucketCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}

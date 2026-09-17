package com.miniaws.miniaws.service.storageService;


import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

public interface FileStorageService {
    String store(MultipartFile multipartFile,String bucketName);

    Resource loadFileAsResource(Path filePath);

}

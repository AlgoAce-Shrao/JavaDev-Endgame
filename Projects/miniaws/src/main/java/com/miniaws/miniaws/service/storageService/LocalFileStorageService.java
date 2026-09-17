package com.miniaws.miniaws.service.storageService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LocalFileStorageService implements FileStorageService{

    @Value("${file.upload-dir}")
    private Path uploadDirectory;

    @Override
    public String store(MultipartFile file,String bucketName) {

        //prepare the storedfilename which is unique
        //take the path of the storage bucket--> resolve it with the storedFilename
        //implement saving the file properly and returning the storedFilename

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            throw new RuntimeException("Valid Name required");
        }

        // derive extension from original filename if present
        String extension = "";
        int idx = originalFilename.lastIndexOf('.');
        if (idx >= 0) {
            extension = originalFilename.substring(idx);
        } else {
            // fallback to content type (e.g., image/png -> .png). map jpeg -> jpg
            String ct = file.getContentType();
            if (ct != null && ct.contains("/")) {
                String sub = ct.substring(ct.indexOf('/') + 1);
                if ("jpeg".equalsIgnoreCase(sub)) sub = "jpg";
                extension = "." + sub;
            }
        }

        String storedName = UUID.randomUUID().toString() + extension;

        Path targetPath = uploadDirectory.resolve(bucketName).resolve(storedName);

        try {
            Files.createDirectories(targetPath.getParent());
            file.transferTo(targetPath);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save the file:" + e);
        }

        return storedName;
    }

    @Override
    public Resource loadFileAsResource(Path filePath) {

        try{
            Resource resource=new UrlResource(filePath.toUri());

            if(resource.exists() && resource.isReadable()){
                return resource;
        }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load the file as resource:" + e);
        }
        throw new RuntimeException("File not found or not readable");
    }


}

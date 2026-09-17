package com.miniaws.miniaws.service;

import com.miniaws.miniaws.BucketManagementService.LocalBucketManagementService;
import com.miniaws.miniaws.dto.UploadResponseDTO;
import com.miniaws.miniaws.entity.FileMetadata;
import com.miniaws.miniaws.repository.BucketRepository;
import com.miniaws.miniaws.repository.FileRepository;
import com.miniaws.miniaws.service.storageService.LocalFileStorageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class FileService {

    private final LocalFileStorageService localFileStorageService;
    private final FileRepository fileRepository;
    private final ModelMapper modelMapper;
    private final LocalBucketManagementService localBucketManagementService;
    private final BucketRepository bucketRepository;

    private static final Logger logger = (Logger) LoggerFactory.getLogger(FileService.class);

    @Value("${file.upload-dir}")
    private Path uploadDirectory;

    @Transactional
    public List<UploadResponseDTO> uploadFile(MultipartFile[] multipartFiles,String bucketName){
        ArrayList<UploadResponseDTO> responseDTOS=new ArrayList<>();
        //store the file and return here
        for(MultipartFile multipartFile:multipartFiles){
            Path targetPath=uploadDirectory.resolve(bucketName);
            String bucket;

            if(!Files.exists(targetPath)){
                bucket=localBucketManagementService.createBucket(bucketName).getBucketName();
            }else{
                bucket=bucketName;
            }
            String storedFilename=localFileStorageService.store(multipartFile,bucket);


            try{
                FileMetadata fileMetadata= FileMetadata.builder()
                        .originalFilename(multipartFile.getOriginalFilename())
                        .storedFilename(storedFilename)
                        .size(multipartFile.getSize())
                        .contentType(multipartFile.getContentType())
                        .path(targetPath.toString())
                        .bucket(bucketRepository.findByBucketName(bucketName).orElseThrow(()->new IllegalArgumentException("No data in db")))
                        .build();
                FileMetadata savedFileData= fileRepository.save(fileMetadata);
                responseDTOS.add(modelMapper.map(savedFileData,UploadResponseDTO.class));
            }catch(Exception e){
                logger.error("Failed to save filemetadata to db: ");

                try{
                    Files.deleteIfExists(uploadDirectory.resolve(bucket).resolve(storedFilename));
                }catch (Exception cleanUpError){
                    throw  new RuntimeException("Failed to cleanup file from storage after db error",cleanUpError);
                }

                throw new RuntimeException("Failed to save fileMetadata to db");
            }
        }
        return responseDTOS;
    }


    public Resource downloadFile(String bucketName,String fileName){
        //search in the db if the file exists in the db

        FileMetadata filemetaData =fileRepository.findByBucket_BucketNameAndOriginalFilename(bucketName,fileName).orElse(null);

        if(filemetaData==null) {
            throw new IllegalArgumentException("File not found in the database");
        }


        Path dirPath=Path.of(filemetaData.getPath());
        Path filePath=dirPath.resolve(filemetaData.getStoredFilename());

        return localFileStorageService.loadFileAsResource(filePath);


    }
}

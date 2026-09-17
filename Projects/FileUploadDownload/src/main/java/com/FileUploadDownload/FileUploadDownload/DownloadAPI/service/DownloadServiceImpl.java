package com.FileUploadDownload.FileUploadDownload.DownloadAPI.service;


import com.FileUploadDownload.FileUploadDownload.DownloadAPI.Respository.DownloadRepository;
import com.FileUploadDownload.FileUploadDownload.UploadAPI.entity.FileEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DownloadServiceImpl implements DownloadService{

    private final DownloadRepository downloadRepository;

    public Resource processDownload(Long fileId){

        Optional<FileEntity> fileEntity=downloadRepository.findById(fileId);

        if(!fileEntity.isPresent()){
            throw new RuntimeException("File details  not found");
        }

        String uploadedPath=fileEntity.get().getUploadPath();

        if(!Files.exists(Path.of(uploadedPath))){
            throw new RuntimeException("File not found");
        }

        Resource resource=new FileSystemResource(uploadedPath);;

        return resource;

    }
}


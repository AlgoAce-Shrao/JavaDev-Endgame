package com.FileUploadDownload.FileUploadDownload.UploadAPI.controller;


import com.FileUploadDownload.FileUploadDownload.UploadAPI.service.UploadService;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/upload")
public class UploadController {

    private final UploadService uploadService ;


    @PostMapping("/uploadFile")
    public ResponseEntity<String> uploadFile(@RequestParam("document") MultipartFile[] multipartfiles){
        uploadService.processUpload(multipartfiles);
        return ResponseEntity.status(HttpStatus.CREATED).body("File uploaded successfully");
    }


}

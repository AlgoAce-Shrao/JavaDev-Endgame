package com.miniaws.miniaws.controller;

import com.miniaws.miniaws.dto.CreateBucketResponseDTO;
import com.miniaws.miniaws.dto.UploadResponseDTO;
import com.miniaws.miniaws.service.BucketService;
import com.miniaws.miniaws.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/uploads")
public class FileUploadController {

    private final BucketService bucketService;
    private final FileService fileService;

    @PostMapping("/createBucket/{bucketName}")
    public ResponseEntity<CreateBucketResponseDTO> createBucket(@PathVariable("bucketName") String bucketName){
        return ResponseEntity.ok(bucketService.createBucket(bucketName));
    }

    @PostMapping("/{bucketName}/uploadFile")
    public ResponseEntity<List<UploadResponseDTO>> processUpload(@RequestParam("files") MultipartFile[] multipartFiles, @PathVariable("bucketName") String bucketName){
        return ResponseEntity.ok(fileService.uploadFile(multipartFiles,bucketName));
    }
}

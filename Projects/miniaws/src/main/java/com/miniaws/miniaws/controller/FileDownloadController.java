package com.miniaws.miniaws.controller;

import com.miniaws.miniaws.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/downloads")
@RequiredArgsConstructor
public class FileDownloadController {

    private final FileService fileService;

    @GetMapping("/{bucketName}/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable("bucketName") String bucketName,@PathVariable("filename") String filename){
        Resource resource=fileService.downloadFile(bucketName,filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\""+resource.getFilename()+"\"")
                .body(resource);

    }
}

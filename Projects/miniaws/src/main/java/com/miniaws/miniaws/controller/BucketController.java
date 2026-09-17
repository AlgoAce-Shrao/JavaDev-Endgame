package com.miniaws.miniaws.controller;

import com.miniaws.miniaws.dto.UploadResponseDTO;
import com.miniaws.miniaws.service.BucketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/buckets")
@RequiredArgsConstructor
public class BucketController {

    private final BucketService bucketService;

    @GetMapping("/bucket/{bucketName}")
    public ResponseEntity<List<UploadResponseDTO>> getBucketFiles(@PathVariable("bucketName") String bucketName){
        return ResponseEntity.ok(bucketService.getfiles(bucketName));

    }
}

package com.miniaws.miniaws.service;

import com.miniaws.miniaws.BucketManagementService.LocalBucketManagementService;
import com.miniaws.miniaws.dto.CreateBucketResponseDTO;
import com.miniaws.miniaws.dto.UploadResponseDTO;
import com.miniaws.miniaws.entity.Bucket;
import com.miniaws.miniaws.repository.BucketRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BucketService {

    private final ModelMapper modelMapper;

    private final LocalBucketManagementService localBucketManagementService;
    private final BucketRepository bucketRepository;

    public CreateBucketResponseDTO createBucket(String bucketName) {
        Bucket bucket=localBucketManagementService.createBucket(bucketName);
        return modelMapper.map(bucket,CreateBucketResponseDTO.class);
    }


    public List<UploadResponseDTO> getfiles(String bucketName) {
        Bucket bucket=bucketRepository.findByBucketName(bucketName).orElseThrow(()->new IllegalArgumentException("Bucket not found"));

        return bucket.getListOfFiles()
                .stream()
                .map(fileMetadata -> modelMapper.map(fileMetadata,UploadResponseDTO.class))
                .toList();



    }
}

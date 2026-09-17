package com.FileUploadDownload.FileUploadDownload.UploadAPI.service;


import org.springframework.web.multipart.MultipartFile;


public interface UploadService {
     void processUpload(MultipartFile[] multipartFiles);
}

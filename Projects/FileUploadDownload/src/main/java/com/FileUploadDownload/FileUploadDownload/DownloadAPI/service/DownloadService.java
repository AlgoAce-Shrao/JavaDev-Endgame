package com.FileUploadDownload.FileUploadDownload.DownloadAPI.service;

import org.hibernate.ResourceClosedException;
import org.springframework.core.io.Resource;

public interface DownloadService {
    Resource processDownload(Long fileId);
}

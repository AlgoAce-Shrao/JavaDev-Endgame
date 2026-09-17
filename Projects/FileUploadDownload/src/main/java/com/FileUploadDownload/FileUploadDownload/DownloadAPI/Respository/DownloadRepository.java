package com.FileUploadDownload.FileUploadDownload.DownloadAPI.Respository;

import com.FileUploadDownload.FileUploadDownload.UploadAPI.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DownloadRepository extends JpaRepository<FileEntity,Long> {

}

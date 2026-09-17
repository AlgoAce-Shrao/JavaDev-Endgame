package com.FileUploadDownload.FileUploadDownload.UploadAPI.repository;

import com.FileUploadDownload.FileUploadDownload.UploadAPI.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UploadRepository extends JpaRepository<FileEntity,Long> {


}

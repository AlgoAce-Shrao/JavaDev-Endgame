package com.FileUploadDownload.FileUploadDownload.DownloadAPI.controlller;

import com.FileUploadDownload.FileUploadDownload.DownloadAPI.service.DownloadService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/download")
public class DownloadController {

    private final DownloadService downloadService;

    @GetMapping("/downloadFile/{id}")
    public ResponseEntity<?> downloadFile(@PathVariable("id") Long fileId){

            //Due::to implement proper download format.

        try{
            Resource resource =downloadService.processDownload(fileId);
            return ResponseEntity.ok().body(resource);

        }catch(RuntimeException re){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(re.getMessage());

        }catch(Exception ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
        }


    }


}

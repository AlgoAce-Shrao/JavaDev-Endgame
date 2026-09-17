package com.FileUploadDownload.FileUploadDownload.UploadAPI.service;

import com.FileUploadDownload.FileUploadDownload.UploadAPI.entity.FileEntity;
import com.FileUploadDownload.FileUploadDownload.UploadAPI.repository.UploadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

@Service
@RequiredArgsConstructor
public class UploadServiceImplementation implements UploadService {

    private final UploadRepository uploadrepo;


    @Value("${file.upload-dir}")
    private  String UPLOADIRECTORY;


    @Override
    public     void processUpload(MultipartFile[] multipartFiles){
        for(MultipartFile file:multipartFiles){

            if(file.isEmpty()){
                throw new RuntimeException("Empty file!! Can't be uploaded");
            }

            if(file.getSize()>1024*1024*1024){
                throw new RuntimeException("File cannpt exceed 3MB size");
            }

            if(file.getContentType().equals("application/vnd.microsoft.portable-executable")){
                throw new RuntimeException("Unauthorized file content ");
            }



            createFile(file);
        }

    }


    private  void createFile(MultipartFile file){
        //traversing each file and doing operation on it here
        //set the path as a folder here only --> UPLOADIRECTORY
        //create the folder if the folder doesn't exist..or ignore
        //take the files' original name and resolve it with uploadDir path only--> destination file
        //save the file to that destination (transferTo)

        //now create the entity
        //save if to the database
        //check if saved to db--> if saved--> return response
        //else delete the file which was saved to local only

        try{
            Path uploadPath=Path.of(UPLOADIRECTORY);

            Files.createDirectories(uploadPath);

            String filename=file.getOriginalFilename();

            if(filename==null){
                throw new RuntimeException("Name required!! ");
            }




            Path targetFile=uploadPath.resolve(filename);

            if(Files.exists(targetFile)){

            }

            file.transferTo(targetFile);

            FileEntity fileEntity=new FileEntity();

            //now create the entity
            fileEntity.setFilename(file.getOriginalFilename());
            fileEntity.setContentType(file.getContentType());
            fileEntity.setUploadPath(targetFile.toString());

            try{
                uploadrepo.save(fileEntity);
            }catch(Exception e){
                Files.deleteIfExists(targetFile);

               throw new RuntimeException("Failed to upload file",e);
            }


        }catch(IOException ioe){
            throw new RuntimeException("Failed to store file on disk",ioe);
        }
    }


}

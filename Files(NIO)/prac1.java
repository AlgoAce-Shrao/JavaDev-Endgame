import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class prac1 {
    public static void main(String[] args) {
       Path uploadDir=Path.of("uploads1");
       try {
           Files.createDirectory(uploadDir);
           System.out.println("Folder created");
       } catch (Exception e) {
       }
       Path targetPath=uploadDir.resolve("testfile.md");
       Path targetPath1=uploadDir.resolve("testPic.jpg");

        try {
            Files.createFile(targetPath);
            System.out.println("file created");
        } catch (IOException ex) {
            System.getLogger(prac1.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }
       System.out.println(targetPath1);
    }
}

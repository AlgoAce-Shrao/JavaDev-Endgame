import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;

public class prac2 {
    public static void main(String args[]){
        Path fileLoc=Path.of("reports.txt");
        // Path targetLoc=fileLoc.resolve(fileLoc);

        //creating a file
        if(!Files.exists(fileLoc)){
            try {
                Files.createFile(fileLoc);
            } catch (IOException ex) {
                ex.printStackTrace();
            }

        }

        //creating a directory/folder
        try {
            Files.createDirectory(Path.of("folder1"));
        } catch (FileAlreadyExistsException e) {
            System.out.println("Folder already exists bitch");
        }catch(Exception ex){
            ex.printStackTrace();
        }

        //creating nested directories
        try {
            Files.createDirectories(Path.of("fol1/fol2/fol3"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        


    }
}

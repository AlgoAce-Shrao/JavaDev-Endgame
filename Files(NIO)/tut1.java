import java.nio.file.Files;
import java.nio.file.Path;

public class tut1{
    public static void main(String[] args) {
        Path path=Path.of("notes.txt");   //relative path
        System.out.println(path);

        System.out.println(Files.exists(path));

        Path path1=Path.of("C:\\JavaDev_endgame\\Files(NIO)\\note.md");  //this is absolute path

        System.out.println(path1.isAbsolute());

        System.out.println(path1.getFileName());

        System.out.println(path1.getParent());
        
        System.out.println(path1.getRoot());


        //💡Resolve PATH--> VERY IMPORTANT  -->useful during making upload api
        Path uploadDir=Path.of("uploads");
        Path target=uploadDir.resolve("notes2.sh");

        System.out.println(Files.exists(target));
    }
}
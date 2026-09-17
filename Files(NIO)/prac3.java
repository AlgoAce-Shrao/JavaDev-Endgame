import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

public class prac3 {
    public static void main(String args[]){
        Path path=Path.of("myName.txt");

        try {
            Files.writeString(path,"\nMy age is : 20" ,StandardOpenOption.CREATE,StandardOpenOption.APPEND);
        } catch (Exception e) {
            e.printStackTrace();
        }


        try {
            List<String> ls=Files.readAllLines(path);
            for(String st:ls){
                System.out.println(st);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

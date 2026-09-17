
import java.io.FileInputStream;

public class tut1 {
    public static void main(String[] args) {
        //fileinputsstream
        try(FileInputStream fs=new FileInputStream("Shrao.txt")) {
            int data;
            while((data=fs.read())!=-1){
                System.out.print((char)data);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

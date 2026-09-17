// this is the use of byteStream
import java.io.FileOutputStream;

public class tut2 {
    public static void main(String[] args) {
        String data="Hello!! I am Shraojit...This line appears when I run this particular code deleting the previous text whatever remains in the file";
        try(FileOutputStream fout=new FileOutputStream("Shrao.txt")) {
            fout.write(data.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}




/*
Hello!! I am Shrao..The best coder out there in KIIT University ..
Beware!!! I am not just a coder...I am a winner cuz that's what I do...
---
I am kinda out of track...kinda disturbed...but I am hell sure I am going to strike back and comeback so strong  enough that people would think me as the hardest motherfucker out there they have ever seen...

*/
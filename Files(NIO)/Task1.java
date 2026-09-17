
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Stream;

// Let's create a Student Notes Manager

public class Task1 {
    static Path currentFilePath;
    static Scanner sc = new Scanner(System.in);

    private static final Path NOTES_FOLDER =
        Path.of("notesAppUploads");

    public static void createNote() {

        Path folder = Path.of("notesAppUploads");
        try {
            Files.createDirectories(folder);
        } catch (IOException ex) {
            System.getLogger(Task1.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }

        System.out.println("Note Name:");
        String noteName = sc.nextLine();

        Path filePath = NOTES_FOLDER.resolve(noteName);
        currentFilePath = filePath;
        if (!Files.exists(filePath)) {
            try {
                Files.createFile(filePath);
            } catch (IOException ex) {
                System.getLogger(Task1.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
            }
            System.out.println("Note created successfully!!! Ready to note down");
        } else {
            System.out.println("Note of same name present!! Choose a different file name");
        }

    }

    public static void writeNote() {
        System.out.println("Enter the name of the note in which u want to write");
        String noteName = sc.nextLine();
        Path notePath =NOTES_FOLDER.resolve(noteName);

        if (!Files.exists(notePath)) {
            System.out.println("No such file exists");
            return;
        }

        currentFilePath=notePath;

        System.out.println("Enter what u want to pen down!!");
        String note = sc.nextLine();

        try {
            Files.writeString(currentFilePath, note+System.lineSeparator(), StandardOpenOption.APPEND);
            System.out.println("Note updated");
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static void readNote() {
        System.out.println("Enter the name of the note which u want to read");
        String noteName = sc.nextLine();
        Path notePath = NOTES_FOLDER.resolve(noteName);

        if (!Files.exists(notePath)) {
            System.out.println("No such file exists");
            return;
        }

        try {
            List<String> ls = Files.readAllLines(notePath);
            for (String line : ls) {
                System.out.println(line);
            }
        } catch (IOException ex) {
            System.getLogger(Task1.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }
    }

    public static void deleteNote() {
        System.out.println("enter the name of the not u want to delete");
        String noteName = sc.nextLine();
        Path notePath = NOTES_FOLDER.resolve(noteName);

        if (!Files.exists(notePath)) {
            System.out.println("No such file exists");
            return;
        }

        try {
            Files.delete(notePath);
            System.out.println("Note deleted successfully");
        } catch (IOException ex) {
            System.getLogger(Task1.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }

    }


    public static void ListAllNotes(){
        try {
            Stream<Path> notes=Files.list(NOTES_FOLDER);
            notes.forEach(System.out::println);
        } catch (IOException ex) {
            System.getLogger(Task1.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }

    }

    public static Long countAllNotes(){
        try {
            return Files.list(NOTES_FOLDER).count();
        } catch (IOException ex) {
            System.getLogger(Task1.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }
        return null;
        
    }

    // Get filenames and file extensions separately in separate columns
    public static void fileDetails(){
        try {
            Files.list(NOTES_FOLDER)
                .map(Path::getFileName)
                .map(Path::toString)
                .forEach(name -> {
                    int dotIndex = name.lastIndexOf('.');
                    if (dotIndex > 0 && dotIndex < name.length() - 1) {
                        String fileName = name.substring(0, dotIndex);
                        String extension = name.substring(dotIndex + 1);
                        System.out.println(fileName + "\t" + extension);
                    } else {
                        System.out.println(name + "\t" + "<no extension>");
                    }
                });
        } catch (IOException ex) {
            System.getLogger(Task1.class.getName()).log(System.Logger.Level.ERROR, (String) null, ex);
        }

    }

    public static void main(String args[]) {
        while (true) {

            System.out.println("Hello!! Welcome to ur first notes manager");
            System.out.println("Choose the following options for doing the same");
            System.out.println("""
                    1.Create\r
                    2.Write\r
                    3.Read\r
                    4.Delete\r
                    5.Exit\r
                    6.List Notes\r
                    7.Count total number of files
                    8.File details""");

            int ch = sc.nextInt();
            sc.nextLine();
            switch (ch) {
                case 1:
                    createNote();
                    break;

                case 2:
                    writeNote();
                    break;
                case 3:
                    readNote();
                    break;
                case 4:
                    deleteNote();
                    break;
                case 5:
                    System.out.println("Exiting the program. Goodbye!!..");
                    System.exit(0);
                    break;
                case 6:
                    ListAllNotes();
                    break;
                case 7:
                    countAllNotes();
                    break;
                case 8:
                    fileDetails();
                    break;
                default:
                    throw new AssertionError("Unknown command...try again...");
            }

        }
    }
}

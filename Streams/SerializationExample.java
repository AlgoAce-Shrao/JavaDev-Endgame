// here we will be learning about Seriealization and deserialization

import java.io.EOFException;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Scanner;

class Person implements Serializable {

    private static final long serialVersionUID=1L;
    String name;
    int age;

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

public class SerializationExample {
    public static void main(String[] args) {
        try (Scanner sc = new Scanner(System.in)) {
            System.out.println("1 -> Save new person");
            System.out.println("2 -> View all logs");
            System.out.println("3 -> Search person by name");
            System.out.print("Choose option: ");
            int n = sc.nextInt();
            sc.nextLine();

            if (n == 1) {
                ArrayList<Person> ls = new ArrayList<>();
                try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("PersonData.txt"))) {
                    ls = (ArrayList<Person>) ois.readObject();
                } catch (FileNotFoundException fe) {
                    System.out.println("No previous data found!!Starting afresh");
                } catch (Exception e) {
                    e.printStackTrace();
                }

                System.out.println("Enter the number of details u want to input");
                int s = sc.nextInt();
                sc.nextLine();

                for (int i = 0; i < s; i++) {
                    System.out.println("Enter the name and age of the person");
                    String name = sc.next();
                    int age = sc.nextInt();
                    sc.nextLine();
                    Person person = new Person(name, age);
                    ls.add(person);
                }

                // Serializing
                try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("PersonData.txt"))) {
                    oos.writeObject(ls);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            // deserialize

            if (n == 2) {
                try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("PersonData.txt"))) {
                    // // System.out.println(ois.readObject());
                    // while (true) {
                    // // Person desPerson = (Person) ois.readObject();
                    // // System.out.println(desPerson.name);
                    // // System.out.println(desPerson.age);

                    // }

                    ArrayList<Person> ls = (ArrayList<Person>) ois.readObject();
                    for (Person ps : ls) {
                        System.out.print(ps.name+"\t");
                        System.out.println(ps.age);
                    }
                } catch (EOFException eofe) {
                    System.out.println("All logs printed ");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }


            if(n==3){
                boolean found=false;
                //search by name function
                System.out.println("Enter the name:");
                String name=sc.next();

                try(ObjectInputStream ois=new ObjectInputStream(new FileInputStream("PersonData.txt"))) {
                    ArrayList<Person> ls = (ArrayList<Person>) ois.readObject();
                    for (Person ps : ls) {
                        if(ps.name.equals(name)) {
                            // as of now assuming the person name is unique and I get the first occurrence as well..just to test the logic and functionlaity
                            System.out.println(ps.name+"->"+ps.age);
                            found=true;
                            // break;

                        }
                    }

                    if(!found) System.out.println("Person not found");
                } catch(Exception e){
                    e.printStackTrace();
                }
            }

        }
    }
}

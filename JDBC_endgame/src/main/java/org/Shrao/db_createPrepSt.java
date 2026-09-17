// now we shall be doing the same crud operation using prepared statement
// Reason--> For better security and to avoid SQL injection
//Hence using Statement weakens the security

import java.util.*;
import java.sql.*;
class db_createPrepSt{
    public static void main(String args[]) {
        try(Scanner sc=new Scanner(System.in)){
            System.out.println("Enter the User credentials");
            int id=sc.nextInt();
            sc.nextLine();
            String name=sc.nextLine();
            int marks=sc.nextInt();

            //We need some valiudation as well
            if(id<=0 || name.trim().isEmpty() || marks<0 || marks >100) throw new IllegalArgumentException("Invalid Input");


           try( Connection con=dbutil.getConnection()){
               System.out.println("connection established successfully");
                String q1="INSERT INTO shrao_ka_details (id,name,marks) values(?,?,?)";
                try(PreparedStatement ptst=con.prepareStatement(q1)){
                    ptst.setInt(1,id);
                    ptst.setString(2,name);
                    ptst.setInt(3,marks);

                    int rowsAffected=ptst.executeUpdate();
                    System.out.println("Executed Query  successfully affecting :"+rowsAffected+" rows");
                }
           }

        }catch(SQLException se){
            System.out.println("Database error:"+se.getMessage());
        } catch (Exception e) {
            System.out.println("Error: "+e.getMessage());
        }
    }
}
/*
Steps for successfull setup of database_deleteFromTable.java connection[Lets use Prostgres]

1. import the packages
2. load and register driver(optional)
3. create connection
4. Create statement
5. Execute Statement
6. Process statement
7. Close the connection

*/

import java.sql.*;
class db_createTable {
    public static  void main(String args[]) throws SQLException{
//        Class.forName("org.postgresql.Driver");



        try(Connection con=dbutil.getConnection()){

            System.out.println("Connection Established");

            try(Statement st=con.createStatement()) {
                String query ="CREATE TABLE shrao_ka_details (\n" +
                        "    id INT,\n" +
                        "    name TEXT,\n" +
                        "    marks INT\n" +
                        ");";
                st.execute(query);
                System.out.println("Query executed successfully affecting  :"+st.getUpdateCount()+"number of rows");


            }
        }
    }
}
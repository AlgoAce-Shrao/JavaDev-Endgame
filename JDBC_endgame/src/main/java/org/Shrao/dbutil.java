// Using the same connection credentials by hardcoding everywhere is very redundant...
//Fix: we will be coding it once and import and use if in other classes

import java.sql.*;
class dbutil{
    static Connection getConnection() throws  SQLException{
        String url="jdbc:postgresql://localhost:5432/Shrao";
        String uname="postgres";
        String pass="Udi<3#Shrao";

        return DriverManager.getConnection(url,uname,pass);
    }
}
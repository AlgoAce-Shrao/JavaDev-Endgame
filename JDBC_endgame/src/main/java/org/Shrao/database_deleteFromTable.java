import java.sql.*;

class database_deleteFromTable{
    public static void main(String args[]) throws SQLException{
        try(Connection con=dbutil.getConnection()){
            //use con here
            System.out.println("Connection estaqblished successsfully ");
            try(Statement st=con.createStatement()){
                String query="DELETE FROM shrao_ka_details\n" +
                        "WHERE id = 10;";

                st.execute(query);
                System.out.println("Execcuted statement affectiong :"+st.getUpdateCount()+" number of rows ");


                System.out.println("Table :");

                try(ResultSet res=st.executeQuery("SELECT * FROM public.shrao_ka_details;")){
                    /// use resultset here
                    while(res.next()){
                        System.out.print(res.getInt(1)+"->");
                        System.out.print(res.getString("name")+"->");
                        System.out.println(res.getInt(3));
                    }
                }
            }
        }
    }
}
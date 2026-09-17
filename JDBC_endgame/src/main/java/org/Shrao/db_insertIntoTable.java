import java.sql.*;

class insertIntoTable{
    public static void main(String args[]) throws SQLException{
        try(Connection con=dbutil.getConnection()){
            //use con here
            System.out.println("Connection estaqblished successsfully ");
            try(Statement st=con.createStatement()){
//                String query="INSERT INTO shrao_ka_details (id, name, marks)\n" +
//                        "VALUES (1, 'Soma', 95);";
                String q2="INSERT INTO shrao_ka_details (id, name, marks)\n" +
                        "VALUES \n" +
                        "(8, 'Unnita', 87),\n" +
                        "(9, 'Anushka', 20);";
                st.executeUpdate(q2);
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
package com.SpringJDBC.SpringJDBC.example.Repository;

import com.SpringJDBC.SpringJDBC.example.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class StudentRepo {

    private JdbcTemplate jdbc;

    public JdbcTemplate getJdbc() {
        return jdbc;
    }

    @Autowired
    public void setJdbc(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void save(Student s){

        String sql="insert into Student (roll,name,marks) values (?,?,?)";

        int rows=jdbc.update(sql,s.getRoll(),s.getName(),s.getMarks());
        System.out.println(rows+" rows affected");

    }



    public List<Student> findAll() {

//        List<Student> students=new ArrayList<>();
//        return students;

        String sql="select * from Student";

        RowMapper<Student> mapper=new RowMapper<Student>() {
            @Override
            public Student mapRow(ResultSet rs, int rowNum) throws SQLException {   //Job of MapRow is take one row from ResultSet one row at a time


                Student s=new Student();

                s.setRoll(rs.getInt("roll"));
                s.setName(rs.getString("name"));
                s.setMarks(rs.getInt("marks"));

                return s;
            }
        };
         return jdbc.query(sql,mapper)  ;   //Row-Mapper helps to retrieve data from the ResultSet one by one
    }
}

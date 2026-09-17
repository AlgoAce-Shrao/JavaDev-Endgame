package com.SpringJDBC.SpringJDBC.example.Service;

import com.SpringJDBC.SpringJDBC.example.Repository.StudentRepo;
import com.SpringJDBC.SpringJDBC.example.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class StudentService {

    private StudentRepo studentrepo;

    public StudentRepo getStudentrepo() {
        return studentrepo;
    }


    @Autowired
    public void setStudentrepo(StudentRepo studentrepo) {
        this.studentrepo = studentrepo;
    }

    public void addStudent(Student student){
        studentrepo.save(student);
    }

    public List<Student> getStudents(){
        return studentrepo.findAll();
    }
}

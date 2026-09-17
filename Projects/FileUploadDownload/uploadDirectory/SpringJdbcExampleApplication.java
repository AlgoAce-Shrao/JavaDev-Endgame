//package com.SpringJDBC.SpringJDBC.example;
//
//import com.SpringJDBC.SpringJDBC.example.Service.StudentService;
//import com.SpringJDBC.SpringJDBC.example.model.Student;
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//import org.springframework.context.ApplicationContext;
//
//@SpringBootApplication
//public class SpringJdbcExampleApplication {
//
//	public static void main(String[] args) {
//
//		ApplicationContext context=SpringApplication.run(SpringJdbcExampleApplication.class, args);
//
//		Student student=context.getBean(Student.class);
//		student.setRoll(104);
//		student.setName("Shrao");
//		student.setMarks(98);
//
//		StudentService studentService=context.getBean(StudentService.class);
//		studentService.addStudent(student);
//		System.out.println(studentService.getStudents());
//
//	}
//
//}

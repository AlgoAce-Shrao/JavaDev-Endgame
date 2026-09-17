package org.Shrao;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Student {

    @Id   //to show this is a primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int rollno;
    private  String sname;
    private int age;


    public int getRollno() {
        return rollno;
    }

    public void setRollno(int rollno) {
        this.rollno = rollno;
    }

    public String getSname() {
        return sname;
    }

    public void setSname(String sname) {
        this.sname = sname;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "rollno=" + rollno +
                ", sname='" + sname + '\'' +
                ", age=" + age +
                '}';
    }
}

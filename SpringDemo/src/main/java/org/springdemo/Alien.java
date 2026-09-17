package org.springdemo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component   //It's a stereotype annotation in spring which tells that this is a class where Spring has to manage the objects for it
public class Alien {

    //used to demonstrate setter injection
    @Value("34")
    private int age;
    private Laptop lap;

    public int getAge() {
        return age;
    }

    //💡to demonstrate constructor injection
    public  Alien(int age,Laptop lap){
        System.out.println("Para constructor called :: to demonstrate Constructor injection");
        this.age=age;
        this.lap=lap;
    }





    public void setAge(int age) {

        System.out.println("Setter called:: in order to demonstrate setter injection");
        this.age = age;
    }

    public Laptop getLap() {
        return lap;
    }

    public void setLap(Laptop lap) {
        this.lap = lap;
    }

    public Alien(){
        System.out.println("Alien object created");
    }

    public void code(){

        System.out.println("Alien is coding perfectly");
    }
}

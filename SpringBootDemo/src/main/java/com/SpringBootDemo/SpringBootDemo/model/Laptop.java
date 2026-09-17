package com.SpringBootDemo.SpringBootDemo.model;


import org.springframework.stereotype.Component;

@Component
public class Laptop implements Computer{

    public void compile(){
        System.out.println("Laptop compiling...");
    }
}

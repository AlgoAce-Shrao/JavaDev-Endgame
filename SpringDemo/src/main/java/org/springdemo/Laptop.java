package org.springdemo;


import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
@Scope("prototype")
public class Laptop {

    public Laptop(){

        System.out.println("Laptop object created successfully");
    }

    public void compile(){
        System.out.println("Laptop being used for coding");
    }
}

package com.SpringBootDemo.SpringBootDemo.Repository;

import com.SpringBootDemo.SpringBootDemo.model.Laptop;
import org.springframework.stereotype.Repository;

@Repository
public class LaptopRepository {

    public void save(Laptop lap){
        System.out.println("Saved in database");
    }
}

package com.SpringBootDemo.SpringBootDemo.service;

//Service is used to dela with business logic or some operations

import com.SpringBootDemo.SpringBootDemo.Repository.LaptopRepository;
import com.SpringBootDemo.SpringBootDemo.model.Laptop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LaptopService {


    @Autowired
    private LaptopRepository repo;


    public void addlaptop(Laptop lap) {
//        System.out.println("Laptop Service method called");
        repo.save(lap);

    }


    public boolean LapIsGood(){
        return true;
    }
}

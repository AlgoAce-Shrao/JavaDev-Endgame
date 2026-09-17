package com.SpringBootDemo.SpringBootDemo;

import com.SpringBootDemo.SpringBootDemo.model.Alien;
import com.SpringBootDemo.SpringBootDemo.model.Laptop;
import com.SpringBootDemo.SpringBootDemo.service.LaptopService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class SpringBootDemoApplication {

	public static void main(String[] args) {
		ApplicationContext context= SpringApplication.run(SpringBootDemoApplication.class, args);

		LaptopService laptopService=context.getBean(LaptopService.class);

		Laptop lap=context.getBean(Laptop.class);
		laptopService.addlaptop(lap);


//		Alien obj=context.getBean(Alien.class);
//		System.out.println(obj.getAge());
//		obj.code();



		// 💡Note:
		// 1. Client sends request to controller-->2. Controller says Service--> Service says Repository--> Repository is responsible for interacting with the db
	}

}

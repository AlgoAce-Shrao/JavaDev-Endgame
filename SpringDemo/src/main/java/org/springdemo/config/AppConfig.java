package org.springdemo.config;

// this file is used for java based configuration instead of XML configuration

import org.springdemo.Alien;
import org.springdemo.Laptop;
import org.springframework.context.annotation.*;

@Configuration
@ComponentScan("org.springdemo")  //used to tell Spring to scan on all the classes and to manage those who have @Component written over them
public class AppConfig {

//    @Bean(name = "lappy")
////    @Scope("prototype")
//    @Primary
//    public Laptop laptop(){
//        return new Laptop();   //creating a new object every time the method is called..💡but not injected by us...but by Spring fml
//    }
//
//
//    @Bean
//    public Laptop lap1(){
//        return new Laptop();
//    }
//
//    @Bean
//    public Alien alienite(){
//        Alien obj=new Alien();
//        obj.setAge(25);
//        return obj;
//    }
}

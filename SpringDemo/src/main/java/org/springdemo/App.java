package org.springdemo;

import org.springdemo.config.AppConfig;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class App
{
    public static void main( String[] args )
    {

                /*
         ===============================================================================================================

            Code for XML based configuration

         ===============================================================================================================

        */

        ApplicationContext context=new AnnotationConfigApplicationContext(AppConfig.class);

        Laptop lap=context.getBean(Laptop.class);   // bean name is the method name of that class only(or sest the attribute in the @Bean upon the method)
        // this won't work unless we do the annotation configurations in the file
        lap.compile();

        Laptop lap1=context.getBean(Laptop.class);
        lap1.compile();

        System.out.println(lap==lap1);   // since on laptop scope is mentioned as prototype hence the answer is false...
        // cuz on prototype e create different objects the number of times it is called

        Alien alien=context.getBean(Alien.class);
//        alien.setAge(23);
        System.out.println(alien.getAge());
        alien.code();













        /*
         ===============================================================================================================

            Code for XML based configuration

         ===============================================================================================================

        */


        /*
        //create the IOC container and also the object here itself
        //the beans mentioned in the configLocation is used by it as an info to create the objects

        //if in xml file the  scope value of the bean is made prototype--> separate objeccts are created for every call
        // if it is made singleton--> then normal--> one object created in ioc container
        ApplicationContext context=new ClassPathXmlApplicationContext("applicationContext.xml");

        //fetch the beans(objects)
        Alien obj1=(Alien)context.getBean("alien");
        obj1.code();

        // obj1.setAge(32);
        System.out.println(obj1.getAge());


        //fetch the beans of the same object again(💡only is fetched...object is created in the container only once)
        Alien obj2=(Alien)context.getBean("alien");
        obj2.code();


        System.out.println(obj2.getAge());


        Laptop lap=(Laptop)context.getBean("lappy");

        */
    }
}

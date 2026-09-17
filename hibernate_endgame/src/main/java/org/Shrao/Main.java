package org.Shrao;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import java.util.*;

public class Main {
    public static void main(String[] args) {

        Scanner sc=new Scanner((System.in));
        Student s1=new Student();

        System.out.println("Enter the credentials of the Student");
        s1.setRollno(sc.nextInt());
        sc.nextLine();
        s1.setSname(sc.nextLine());
        s1.setAge(sc.nextInt());

        //Steps to save the input to  the database using the hibernate ORM

        Configuration cfg=new Configuration();
        cfg.addAnnotatedClass(org.Shrao.Student.class);

        cfg.configure();

        SessionFactory sf=cfg.buildSessionFactory();   //??Use it once per db



        Session session=sf.openSession();   //we need to use it for ecery task...like for each and every db operation we need to open the session for doing the operation..Similar is the thing

        Transaction transaction=session.beginTransaction();

        session.persist(s1);

        transaction.commit();
//        System.out.println(s1);


    }
}
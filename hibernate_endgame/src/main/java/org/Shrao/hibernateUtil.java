package org.Shrao;//here we shall setup the sessionfactory which is required for the database conenction

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class hibernateUtil{
    private static final SessionFactory sessionFactory;


    static{
        try{
            sessionFactory=new Configuration()
                    .addAnnotatedClass(org.hiber_endgame.endgame_rec.class)
                    .configure()
                    .buildSessionFactory();
        }catch(Throwable ex){
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static SessionFactory getSessionFactory(){
        return sessionFactory;
    }
}
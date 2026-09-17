package org.hiber_endgame;

//lets rock and roll

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.Shrao.hibernateUtil;

import java.util.*;
public class CreateWarrior {  // this is a Create operation
    public static void  main(String args[]){
        try(Scanner sc=new Scanner(System.in)){
            System.out.println("Enter the details about the endgame warrior");
            endgame_rec rc=new endgame_rec();



            rc.setWarNo(sc.nextInt());
            sc.nextLine();
            rc.setImpact_warrior(sc.nextLine());
            rc.setWeapon(sc.nextLine());

            Transaction transaction=null;

            //db connection
            try(Session session =hibernateUtil.getSessionFactory().openSession()){
                transaction=session.beginTransaction();
                session.persist(rc);
                transaction.commit();
                System.out.println("Warrior details created successfully");
            }catch(Exception e){
                if(transaction != null && transaction.isActive()) transaction.rollback();

                e.printStackTrace();
            }


        }
    }
}
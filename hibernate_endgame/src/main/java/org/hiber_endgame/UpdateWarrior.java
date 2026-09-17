package org.hiber_endgame;

// Update operation

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.Shrao.hibernateUtil;

import java.util.Scanner;

public class UpdateWarrior{
    public static void main(String args[]){

        try(Scanner sc=new Scanner(System.in)){
            System.out.println("Enter the warrior number");
            int warNo=sc.nextInt();
            sc.nextLine();

            //Basic Valiation
            if(warNo<=0) {
                System.out.println("Invalid Warrior Number !!!");
                return;
            }

            Transaction transaction=null;

            try(Session session=hibernateUtil.getSessionFactory().openSession()){

                // fetch the existing record
                endgame_rec warrior=session.find(endgame_rec.class,warNo);

                if(warrior==null){
                    System.out.println("Warrior doesn't exist");
                    return;
                }

                System.out.println("Current Data: "+warrior);

                System.out.println("Enter the new name of the warrior(Press Enter to skip)");
                String name=sc.nextLine();

                System.out.println("Enter the new weapon (Press Enter to skip)");
                String weapon=sc.nextLine();

                transaction=session.beginTransaction();

                if(!name.trim().isEmpty()){
                    warrior.setImpact_warrior(name);
                }

                if(!weapon.trim().isEmpty()){
                    warrior.setWeapon(weapon);
                }


                // 🔹 Step 5: No explicit update() needed!
                // Hibernate auto-detects changes (Dirty Checking)

//                session.merge(warrior);

                transaction.commit();

                System.out.println("Data updaed successully");
                System.out.println("Updated Data: "+warrior);
            }catch(Exception e){
                if(transaction!=null && transaction.isActive()){
                    transaction.rollback();
                }

                e.printStackTrace();
            }
        }
    }
}
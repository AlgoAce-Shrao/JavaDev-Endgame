package org.hiber_endgame;

// Read operation here

import org.hibernate.Session;
import org.Shrao.hibernateUtil;
import org.hibernate.query.Query;

import java.util.List;
import java.util.Scanner;

public class getWarrior{

    public static endgame_rec getWarrior(int warno){
        try(Session session=hibernateUtil.getSessionFactory().openSession()){
            return session.find(endgame_rec.class,warno);
        }
    }

    //method to get the entire table as data

    public static List<endgame_rec> getAllWarriors(){
        try(Session session2=hibernateUtil.getSessionFactory().openSession()){


            //we need to implement it using HQL--> Hibrenate Query Language
            //
            Query<endgame_rec> query= session2.createQuery("from endgame_rec",endgame_rec.class);
            List<endgame_rec> warrior_details= query.getResultList();

            //Validation
            if(warrior_details.isEmpty()){
                System.out.println("No warrior found");
            }

            return warrior_details;
        }
    }

    public static void main(String args[]){
        try(Scanner sc=new Scanner(System.in)){
            System.out.println("enter the id of the warrior");
            int warno=sc.nextInt();
            sc.nextLine();

            if(warno<=0){
                System.out.println("Invalid warno");
                return;
            }

            System.out.println("The details of thw warrior is :"+getWarrior(warno));

            //TO get the entire table as output
            int choice=0;
            System.out.println("Enter 1 if u want to get the details of all the warriors(Press any other key to skip)");
            choice=sc.nextInt();
            sc.nextLine();


            if(choice!=1){
                System.out.println("Bhadwe !! Tera hi choice tha");

            }else{
                List<endgame_rec> warriors=getAllWarriors();
//                System.out.println("Warrior details: "+warriors);

                for(endgame_rec w:warriors){
                    System.out.println(w.toString());
                }
            }



        }catch(Exception e){
            e.printStackTrace();
        }
    }
}
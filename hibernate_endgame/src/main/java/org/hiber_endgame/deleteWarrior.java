package org.hiber_endgame;

import org.hibernate.Session;
import org.hibernate.Transaction;
import org.Shrao.hibernateUtil;

import java.util.Scanner;

public class deleteWarrior {
    public static void main(String args[]) {

        try (Scanner sc = new Scanner(System.in)) {
            System.out.println("Enter the id of the warrior u want to delete");
            int warNo = sc.nextInt();
            sc.nextLine();

            // 🔹 Validation
            if (warNo <= 0) {
                System.out.println("Invalid ID!");
                return;
            }

            Transaction transaction = null;
            try (Session session = hibernateUtil.getSessionFactory().openSession()) {
                transaction = session.beginTransaction();

                endgame_rec warrior = session.find(endgame_rec.class, warNo);

                if (warrior == null) {
                    System.out.println("Warrior not found!");
                    transaction.rollback();
                } else {
                    session.remove(warrior);
                    transaction.commit();
                    System.out.println("Warrior deleted successfully!");
                }
            } catch (Exception e) {
                if (transaction != null && transaction.isActive()) {
                    transaction.rollback();
                }
                System.out.println("Error deleting warrior: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
}
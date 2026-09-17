package org.library.model;

import java.sql.Array;
import java.util.ArrayList;
import java.util.List;

public class User {

    //schema for user details
    private int userId;
    private String username;
    private List<Book> borrowedBooks=new ArrayList<>();


    public User(){}

    public User(int userId, String username) {
        this.userId = userId;
        this.username = username;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Book> getBorrowedBooks() {
        return borrowedBooks;
    }

    public void setBorrowedBooks(List<Book> borrowedBooks) {
        this.borrowedBooks = borrowedBooks;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", borrowedBooks=" + borrowedBooks +
                '}';
    }
}

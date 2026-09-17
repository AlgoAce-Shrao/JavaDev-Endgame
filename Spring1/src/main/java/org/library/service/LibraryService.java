package org.library.service;

import org.library.model.Book;
import org.library.model.User;

public class LibraryService {
    //logic for borrow book
    // logic for returning book

    private BookService bookService;
    private UserService userService;

    public BookService getBookService() {
        return bookService;
    }

    public void setBookService(BookService bookService) {
        this.bookService = bookService;
    }

    public UserService getUserService() {
        return userService;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }


    public  void borrowBook(int userId,int bookId){

        User user=userService.getUserRepository().getUserById(userId);
        Book book=bookService.getBookRepository().findById(bookId);

        if(user==null){
            System.out.println("User not found");
            return;
        }

        if(book==null){
            System.out.println("Book not found");
            return;
        }


        if(!bookService.isAvailable(book)){
            System.out.println("Book not available");
            return;
        }

        userService.assignBook(user,book);

        bookService.decreaseCopies(book);

        System.out.println("Book borrowed successfully");


    }


    public void returnBook(int userId,int bookId){
        User user=userService.getUserRepository().getUserById(userId);
        Book book=bookService.getBookRepository().findById(bookId);

        if(user==null){
            System.out.println("User not found");
            return;
        }

        if(book==null){
            System.out.println("Book not found");
            return;
        }

        userService.removeBook(user,book);

        bookService.increaseCopies(book);

        System.out.println("Book returned successfully");
    }
}

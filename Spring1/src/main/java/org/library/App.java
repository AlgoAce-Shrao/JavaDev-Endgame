package org.library;

import org.library.model.Book;
import org.library.model.User;
import org.library.repository.BookRepository;
import org.library.repository.UserRepository;
import org.library.service.BookService;
import org.library.service.LibraryService;
import org.library.service.UserService;

public class App{

    public static void main(String args[]){

        //Coordination
        BookRepository bookrepo=new BookRepository();
        UserRepository userrepo=new UserRepository();

        BookService bookService=new BookService();
        bookService.setBookRepository(bookrepo);

        UserService userService=new UserService();
        userService.setUserRepository(userrepo);

        LibraryService libraryService=new LibraryService();
        libraryService.setBookService(bookService);
        libraryService.setUserService(userService);

        Book book1=new Book(1,"Haunting Adeline",5);
        bookrepo.addBook(book1);
        User user1=new User(101,"Shrao");
        userrepo.addUser(user1);

        libraryService.borrowBook(101,1);

        System.out.println(book1);
        System.out.println(user1);

    }
}
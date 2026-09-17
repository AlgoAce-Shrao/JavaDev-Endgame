package org.library.repository;

import org.library.model.Book;

import java.util.ArrayList;
import java.util.List;

public class BookRepository {

    private List<Book> bookList=new ArrayList<>(); // this works as the db alternative

    public void addBook(Book book){
          bookList.add(book);
    }

    public Book findById(int bookId){
        for(Book b:bookList){
            if(b.getBookId()==bookId){
                return b;
            }
        }
        return null;
    }


    public List<Book> findAllBooks(){
        return bookList;
    }
}

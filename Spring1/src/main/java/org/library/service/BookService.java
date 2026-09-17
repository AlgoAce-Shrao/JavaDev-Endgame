package org.library.service;

import org.library.model.Book;
import org.library.repository.BookRepository;

public class BookService {

    private BookRepository bookRepository;


    public BookRepository getBookRepository() {
        return bookRepository;
    }

    public void setBookRepository(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book getBookById(int bookId){
        return bookRepository.findById(bookId);
    }

    public boolean isAvailable(Book book){
        return book.getAvailableCopies()>0;
    }

    public  void increaseCopies(Book book){
        book.setAvailableCopies(book.getAvailableCopies()+1);
    }


    public void decreaseCopies(Book book){
        book.setAvailableCopies(book.getAvailableCopies()-1);
    }


}

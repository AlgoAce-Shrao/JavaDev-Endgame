package org.library.service;

import org.library.model.Book;
import org.library.model.User;
import org.library.repository.UserRepository;

public class UserService {

    private UserRepository userRepository;

    public UserRepository getUserRepository() {
        return userRepository;
    }

    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public void assignBook(User user, Book book){
        user.getBorrowedBooks().add(book);
    }

    public void removeBook(User user, Book book){
        user.getBorrowedBooks().remove(book);
    }
}

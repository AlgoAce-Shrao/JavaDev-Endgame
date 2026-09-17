package org.library.repository;

import org.library.model.User;

import java.util.ArrayList;
import java.util.List;

public class UserRepository {

    //in-memory db
    private List<User> userList=new ArrayList<>();

    public void addUser(User user){
        userList.add(user);
    }

    public User getUserById(int userId){
        for(User u:userList){
            if(u.getUserId()==userId){
                return u;
            }
        }
        return null;
    }

    public List<User> getAllUsers(){
        return userList;
    }


}

package com.app.Echohub.Service.Impl;

import com.app.Echohub.Exceptions.InvalidUsernameOrPasswordException;
import com.app.Echohub.Model.User;
import com.app.Echohub.Repository.UserRepository;
import com.app.Echohub.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidUsernameOrPasswordException("User not found with email: " + email));
    }

    @Override
    public void persist(User user) {
        userRepository.save(user);
    }

}


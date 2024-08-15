package com.app.VidOrbit.Service.Impl;

import com.app.VidOrbit.Exceptions.InvalidUsernameOrPasswordException;
import com.app.VidOrbit.Model.User;
import com.app.VidOrbit.Repository.UserRepository;
import com.app.VidOrbit.Service.UserService;
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


//package com.app.Echohub.security;
//
//import com.app.Echohub.model.User;
//import com.app.Echohub.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//public class UserDetailsServiceImpl implements UserDetailsService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        User user = userRepository.findByEmail(email).orElseThrow(()->new UsernameNotFoundException("User not found"));
//        System.out.println("load user by user name ");
//        return UserDetailsImpl.builder().user(user).build();
//    }
//
//}

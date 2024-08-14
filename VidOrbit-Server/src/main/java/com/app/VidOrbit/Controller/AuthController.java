package com.app.VidOrbit.Controller;

import com.app.VidOrbit.DTO.Request.AuthRequest;
import com.app.VidOrbit.DTO.Request.RegisterRequest;
import com.app.VidOrbit.DTO.Response.AuthResponse;
import com.app.VidOrbit.DTO.Response.RegisterResponse;
import com.app.VidOrbit.Exceptions.UsernameAlreadyExistsException;
import com.app.VidOrbit.Security.AuthenticationTokenServiceImpl;
import com.app.VidOrbit.Security.UserDetailsServiceImpl;
import com.app.VidOrbit.Model.User;
import com.app.VidOrbit.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthenticationTokenServiceImpl jwtService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@RequestBody RegisterRequest registerRequest) {
//      Check is username is already present or not
        if (userRepository.findByEmail(registerRequest.getEmail()) != null) {
            throw new UsernameAlreadyExistsException("Username already taken!");
        }
//      Encode password and persist it to DB
        User user = User.builder().email(registerRequest.getEmail()).password(bCryptPasswordEncoder.encode(registerRequest.getPassword())).build();
        userRepository.save(user);
        String token = jwtService.generateToken(user.getEmail());
        return new ResponseEntity<>(RegisterResponse.builder().token(token).createdAt(LocalDateTime.now()).build(), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody AuthRequest authRequest) {
//      find user in DB if found then match the password with encoded password
        User user = userRepository.findByEmail(authRequest.getEmail());
        if (!(user != null && bCryptPasswordEncoder.matches(authRequest.getPassword(), user.getPassword()))) {
            throw new UsernameAlreadyExistsException("Invalid username or password");
        } else {
            String token = jwtService.generateToken(user.getEmail());
            return new ResponseEntity<>(AuthResponse.builder().token(token).build(), HttpStatus.OK);
        }
    }

}

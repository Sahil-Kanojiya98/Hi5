//package com.app.Echohub.controller;
//
//import com.app.Echohub.dto.request.AuthRequest;
//import com.app.Echohub.dto.request.AuthTokenRefereshRequest;
//import com.app.Echohub.dto.request.RegisterRequest;
//import com.app.Echohub.dto.response.AuthResponse;
//import com.app.Echohub.dto.response.AuthTokenRefereshResponse;
//import com.app.Echohub.dto.response.RegisterResponse;
//import com.app.Echohub.service.AuthService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    @Autowired
//    private AuthService authService;
//
//    @PostMapping("/register")
//    public ResponseEntity<RegisterResponse> registerUser(@RequestBody RegisterRequest registerRequest) {
//        RegisterResponse response = authService.registerUser(registerRequest);
//        return new ResponseEntity<>(response, HttpStatus.CREATED);
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody AuthRequest authRequest) {
//        AuthResponse response = authService.authenticateUser(authRequest);
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    @PostMapping("/refresh")
//    public ResponseEntity<AuthTokenRefereshResponse> rotateToken(@RequestBody AuthTokenRefereshRequest refereshRequest) {
//        System.out.println("refereshRequest :"+refereshRequest);
//        AuthTokenRefereshResponse response = authService.rotateToken(refereshRequest);
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//}

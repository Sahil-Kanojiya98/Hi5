package com.app.Echohub.Controller;

import com.app.Echohub.DTO.Request.AuthRequest;
import com.app.Echohub.DTO.Request.AuthTokenRefereshRequest;
import com.app.Echohub.DTO.Request.RegisterRequest;
import com.app.Echohub.DTO.Response.AuthResponse;
import com.app.Echohub.DTO.Response.AuthTokenRefereshResponse;
import com.app.Echohub.DTO.Response.RegisterResponse;
import com.app.Echohub.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@RequestBody RegisterRequest registerRequest) {
        RegisterResponse response = authService.registerUser(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@RequestBody AuthRequest authRequest) {
        AuthResponse response = authService.authenticateUser(authRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthTokenRefereshResponse> rotateToken(@RequestBody AuthTokenRefereshRequest refereshRequest) {
        System.out.println("refereshRequest :"+refereshRequest);
        AuthTokenRefereshResponse response = authService.rotateToken(refereshRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}

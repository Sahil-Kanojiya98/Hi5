package com.app.Echohub.Controller;

import com.app.Echohub.DTO.Request.LogoutRequest;
import com.app.Echohub.Model.User;
import com.app.Echohub.Security.UserDetailsImpl;
import com.app.Echohub.Service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private AuthService authService;

    @GetMapping("/get-me")
    public User getMe(@AuthenticationPrincipal UserDetailsImpl userDetails){
        return userDetails.getUser();
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody LogoutRequest request) {
        String response = authService.logout(request.getRefreshToken());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
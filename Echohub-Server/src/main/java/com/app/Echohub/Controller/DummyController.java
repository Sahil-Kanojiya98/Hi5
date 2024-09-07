package com.app.Echohub.Controller;

import com.app.Echohub.Security.UserDetailsImpl;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class DummyController {

    @GetMapping("/hello")
    public String hello(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        System.out.println(userDetails);
        System.out.println("userDetails.getUsername() = " + userDetails.getUsername());
        System.out.println("userDetails.getPassword() = " + userDetails.getPassword());
        System.out.println("userDetails.getAuthorities() = " + userDetails.getAuthorities());
        System.out.println("userDetails.getUser() = " + userDetails.getUser());
        return "hello world user";
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/hello-admin")
    public String hello_admin(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        System.out.println(userDetails);
        return "hello world admin";
    }

}

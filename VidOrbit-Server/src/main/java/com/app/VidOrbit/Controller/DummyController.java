package com.app.VidOrbit.Controller;

import com.app.VidOrbit.Security.UserDetailsImpl;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DummyController {

    @GetMapping("/hello")
    public String hello(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        System.out.println(userDetails);
        return "hello world";
    }

}

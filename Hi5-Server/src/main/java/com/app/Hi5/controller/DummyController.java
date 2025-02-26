package com.app.Hi5.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.*;


@Slf4j
@RestController
@RequestMapping("/api/dummy")
@RequiredArgsConstructor
public class DummyController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @GetMapping
    public void fire(@RequestParam("query") String query) {
        System.out.println(query);
        simpMessagingTemplate.convertAndSend(query, Map.of("Hello", "World"));
    }

//    @GetMapping
//    public String dummy() {
//        log.info("Dummy endpoint called.");
//        return "Hello World";
//    }
//    @Autowired
//    private SimpMessagingTemplate simpMessagingTemplate;
//    @PostMapping("/send/{user_id}")
//    public String send(@PathVariable("user_id") String userId){
//        simpMessagingTemplate.convertAndSend("/notifications/"+userId,"hello world");
//        return "sended";
//    }
//    @GetMapping("/hello")
//    public ProblemDetail hello(){
//        return ProblemDetail.forStatusAndDetail(
//                HttpStatus.BAD_REQUEST,
//                "custom error"
//        );
//    }
//    @Autowired
//    OtpService otpService;
//    @Autowired
//    OtpRepository otpRepository;
//    @PostMapping("/otp")
//    public String otpGenerate(){
//        return otpService.generateOtp("sahilkanojiya1000@gmail.com");
//    }
//    @GetMapping("/getotp")
//    public Otp get(@RequestParam("otp") String otp,@RequestParam("email") String email){
//        return otpRepository.findByOtpAndEmail(otp,email).orElse(new Otp());
//    }
//    @PreAuthorize("hasRole('USER')")
//    @GetMapping("/hello")
//    public String hello(@AuthenticationPrincipal UserDetailsImpl userDetails) {
//        System.out.println(userDetails);
//        System.out.println("userDetails.getUsername() = " + userDetails.getUsername());
//        System.out.println("userDetails.getPassword() = " + userDetails.getPassword());
//        System.out.println("userDetails.getAuthorities() = " + userDetails.getAuthorities());
//        System.out.println("userDetails.getUser() = " + userDetails.getUser());
//        return "hello world user";
//    }
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/hello-admin")
//    public String hello_admin(@AuthenticationPrincipal UserDetailsImpl userDetails) {
//        System.out.println(userDetails);
//        return "hello world admin";
//    }
//    @PreAuthorize("hasRole('SUPER_ADMIN')")
//    @GetMapping("/hello-super-admin")
//    public String hello_super_admin(@AuthenticationPrincipal UserDetailsImpl userDetails) {
//        System.out.println(userDetails);
//        return "hello world admin";
//    }
}

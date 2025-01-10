package com.app.Hi5.controller;

import com.app.Hi5.dto.response.GetMeResponse;
import com.app.Hi5.model.User;
import com.app.Hi5.security.UserDetailsImpl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/get-me")
    @PreAuthorize("principal.isAccountNonLocked()")
    public ResponseEntity<GetMeResponse> getMe(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Received request to get user details for username: {}", userDetails.getUsername());
        User user = userDetails.getUser();
        log.info("User details fetched successfully for username: {}", user.getUsername());
        return GetMeResponse.builder().id(user.getId().toHexString()).email(user.getEmail()).username(user.getUsername()).role(user.getRole()).fullname(user.getFullname()).profilePictureUrl(user.getProfileImageUrl()).status(HttpStatus.OK).statusCode(HttpStatus.OK.value()).build().toResponseEntity();
    }

//    @GetMapping("/{userId}")
//    public ResponseEntity<UserProfileDTO> getUser(@PathVariable("userId") String userId, @AuthenticationPrincipal UserDetailsImpl userDetails){
//        UserProfileDTO response=userService.getProfile(userId,userDetails.getUser().getId());
//        return new ResponseEntity<>(response,HttpStatus.OK);
//    }
//
//    @PostMapping("/follow/{user_id}")
//    public ResponseEntity<String> followUser(@PathVariable("user_id") String user_id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
//        String message=userService.follow(user_id,userDetails.getUser());
//        return new ResponseEntity<>(message,HttpStatus.OK);
//    }
//
//    @PostMapping("/unfollow/{user_id}")
//    public ResponseEntity<String> unfollowUser(@PathVariable("user_id") String user_id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
//        String message=userService.unfollow(user_id,userDetails.getUser());
//        return new ResponseEntity<>(message,HttpStatus.OK);
//    }
//
//    @PutMapping
//    public ResponseEntity<User> updateUser(@RequestBody UpdateUserRequest updateUserRequest,@AuthenticationPrincipal UserDetailsImpl userDetails) {
//        System.out.println(updateUserRequest);
//        User user=userService.updateUser(userDetails.getUser(), updateUserRequest);
//        return new ResponseEntity<>(user,HttpStatus.OK);
//    }
//
//    @PostMapping("/update-images")
//    public ResponseEntity<ImageUpdateResponseDTO> updateUserImages(
//            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
//            @RequestParam(value = "coverPicture", required = false) MultipartFile coverPicture,
//            @AuthenticationPrincipal UserDetailsImpl userDetails
//            ) throws RuntimeException {
//        ImageUpdateResponseDTO response = userService.updateUserImages(userDetails.getUser(), profilePicture, coverPicture);
//        System.out.println(response);
//        return new ResponseEntity<>(response,HttpStatus.OK);
//    }
//
//    @GetMapping("/saved-posts")
//    public ResponseEntity<List<PostResponseDTO>> getSavedPosts(
//            @AuthenticationPrincipal UserDetailsImpl userDetails,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int pageSize) {
//        System.out.println("this is me");
//        List<PostResponseDTO> savedPosts = userService.getAllSavedPosts(userDetails.getUser(), page, pageSize);
//        return new ResponseEntity<>(savedPosts, HttpStatus.OK);
//    }
//
//    @PostMapping("/saved-posts/{post_id}")
//    public ResponseEntity<String> addSavedPost(
//            @PathVariable("post_id") String post_id,
//            @AuthenticationPrincipal UserDetailsImpl userDetails
//    ){
//        userService.addSavedPost(userDetails.getUser(),post_id);
//        return new ResponseEntity<>("post added successfully!",HttpStatus.OK);
//    }
//
//    @DeleteMapping("/saved-posts/{post_id}")
//    public ResponseEntity<String> removeSavedPost(
//            @PathVariable("post_id") String post_id,
//            @AuthenticationPrincipal UserDetailsImpl userDetails
//    ){
//        userService.removeSavedPost(userDetails.getUser(),post_id);
//        return new ResponseEntity<>("post removed successfully!",HttpStatus.OK);
//    }
//
//
//    @GetMapping("/search")
//    public Page<User> search(@RequestParam String pattern,
//                             @RequestParam(defaultValue = "0") int page,
//                             @RequestParam(defaultValue = "10") int size) {
//        return userService.searchUsers(pattern, page, size);
//    }
//
//    @GetMapping("/suggest")
//    public ResponseEntity<List<UserDescResponse>> suggestUsers(){
//        List<UserDescResponse> users=userService.suggest();
//        return new ResponseEntity<>(users,HttpStatus.OK);
//    }

}
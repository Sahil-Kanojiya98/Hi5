package com.app.Hi5.controller;

import com.app.Hi5.dto.request.FollowRequestActionRequest;
import com.app.Hi5.dto.request.UpdateUserRequest;
import com.app.Hi5.dto.response.*;
import com.app.Hi5.model.User;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/get-me")
    @PreAuthorize("principal.isAccountNonLocked()")
    public ResponseEntity<GetMeResponse> getMe(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.info("Received request to get user details for username: {}", userDetails.getUsername());
        User user = userDetails.getUser();
        log.info("User details fetched successfully for username: {}", user.getUsername());
        return GetMeResponse.builder().id(user.getId().toHexString()).email(user.getEmail()).username(user.getUsername()).role(user.getRole()).fullname(user.getFullname()).profilePictureUrl(user.getProfileImageUrl()).status(HttpStatus.OK).statusCode(HttpStatus.OK.value()).build().toResponseEntity();
    }

    @GetMapping("/search/{keyword}")
    @PreAuthorize("principal.isAccountNonLocked()")
    public ResponseEntity<List<UserSearchResponse>> getUsersByPrefix(@PathVariable("keyword") String keyword, @RequestParam("page") Integer page, @RequestParam("size") Integer size, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<UserSearchResponse> responses = userService.getUsersByKeyword(keyword, page, size, userDetails.getUser());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable("userId") String userId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        UserProfileResponse response = userService.getProfile(userId, userDetails.getUser());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/update-images")
    public ResponseEntity<UpdateImagesResponse> updateUserImages(@RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture, @RequestParam(value = "coverPicture", required = false) MultipartFile coverPicture, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        UpdateImagesResponse response = userService.updateUserImages(userDetails.getUser(), profilePicture, coverPicture);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<String> updateUser(@RequestBody @Valid UpdateUserRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        userService.updateUser(userDetails.getUser(), request.getFullname(), request.getBio(), request.getLink(), request.getDateOfBirth(), request.getGender());
        return new ResponseEntity<>("User Updated Successfully.", HttpStatus.OK);
    }

    @PostMapping("/follow/{user_id}")
    public ResponseEntity<FollowUserResponse> followUser(@PathVariable("user_id") String userId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        FollowUserResponse response = userService.follow(userDetails.getUser(), userId);
        return response.toResponseEntity();
    }

    @PostMapping("/unfollow/{user_id}")
    public ResponseEntity<FollowUserResponse> unfollowUser(@PathVariable("user_id") String userId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        FollowUserResponse response = userService.unfollow(userDetails.getUser(), userId);
        return response.toResponseEntity();
    }


    @PostMapping("/follow/allow")
    public ResponseEntity<String> allowFollowRequest(@RequestBody FollowRequestActionRequest request) {
        userService.allowFollowRequest(request.getNotificationId());
        return ResponseEntity.ok("Follow request allowed");
    }

    @PostMapping("/follow/deny")
    public ResponseEntity<String> denyFollowRequest(@RequestBody FollowRequestActionRequest request) {
        userService.denyFollowRequest(request.getNotificationId());
        return ResponseEntity.ok("Follow request denied");
    }

//    on user accoun delete remove all the posts and its all history
//    @GetMapping("/{userId}")
//    public ResponseEntity<UserProfileResponse> getUser(@PathVariable("userId") String userId, @AuthenticationPrincipal UserDetailsImpl userDetails){
//        UserProfileResponse response=userService.getProfile(userId,userDetails.getUser().getId());
//        return new ResponseEntity<>(response,HttpStatus.OK);
//    }

//    @GetMapping("/saved-posts")
//    public ResponseEntity<List<PostResponseDTO>> getSavedPosts(
//            @AuthenticationPrincipal UserDetailsImpl userDetails,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int pageSize) {
//        System.out.println("this is me");
//        List<PostResponseDTO> savedPosts = userService.getAllSavedPosts(userDetails.getUser(), page, pageSize);
//        return new ResponseEntity<>(savedPosts, HttpStatus.OK);
//    }

//    @GetMapping("/search")
//    public Page<User> search(@RequestParam String pattern,
//                             @RequestParam(defaultValue = "0") int page,
//                             @RequestParam(defaultValue = "10") int size) {
//        return userService.searchUsers(pattern, page, size);
//    }

//    @GetMapping("/suggest")
//    public ResponseEntity<List<UserDescResponse>> suggestUsers(){
//        List<UserDescResponse> users=userService.suggest();
//        return new ResponseEntity<>(users,HttpStatus.OK);
//    }

}
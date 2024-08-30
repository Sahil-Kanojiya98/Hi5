package com.app.Echohub.Controller;

import com.app.Echohub.DTO.Request.LogoutRequest;
import com.app.Echohub.DTO.Request.UpdateUserRequest;
import com.app.Echohub.Exceptions.EntityNotFoundException;
import com.app.Echohub.Model.Post;
import com.app.Echohub.Model.RefreshToken;
import com.app.Echohub.Model.User;
import com.app.Echohub.Repository.UserRepository;
import com.app.Echohub.Security.UserDetailsImpl;
import com.app.Echohub.Service.AuthService;
import com.app.Echohub.Service.PostService;
import com.app.Echohub.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @GetMapping("/get-me")
    public User getMe(@AuthenticationPrincipal UserDetailsImpl userDetails){
        return userDetails.getUser();
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody LogoutRequest request) {
        String response = authService.logout(request.getRefreshToken());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{user_id}")
    public ResponseEntity<User> getUser(@PathVariable("user_id") String user_id){
        User user = userRepository.findById(user_id).orElseThrow(() -> new EntityNotFoundException("User not found!"));
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUserName(@PathVariable("username") String username){
        System.out.println(username);
        User user = userRepository.findByUsername(username).orElseThrow(() -> new EntityNotFoundException("User not found!"));
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @GetMapping("/followers/{user_id}")
    public ResponseEntity<List<User>> getFollowers(@PathVariable("user_id") String user_id) {
        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        List<User> followers = userRepository.findAllById(user.getFollowers());
        return new ResponseEntity<>(followers, HttpStatus.OK);
    }

    @GetMapping("/followings/{user_id}")
    public ResponseEntity<List<User>> getFollowings(@PathVariable("user_id") String user_id) {
        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new EntityNotFoundException("User not found!"));
        List<User> followings = userRepository.findAllById(user.getFollowings());
        return new ResponseEntity<>(followings, HttpStatus.OK);
    }

    @PostMapping("/follow/{user_id}")
    public ResponseEntity<String> followUser(@PathVariable("user_id") String user_id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = userDetails.getUser();
        User userToFollow = userRepository.findById(user_id)
                .orElseThrow(() -> new EntityNotFoundException("User to follow not found!"));
        if (currentUser.getId().equals(userToFollow.getId())) {
            return new ResponseEntity<>("You cannot follow yourself.", HttpStatus.BAD_REQUEST);
        }
        currentUser.getFollowings().add(userToFollow.getId());
        userToFollow.getFollowers().add(currentUser.getId());
        userRepository.save(currentUser);
        userRepository.save(userToFollow);
        //send notifications
        return new ResponseEntity<>("User followed successfully.", HttpStatus.OK);
    }

    @PostMapping("/unfollow/{user_id}")
    public ResponseEntity<String> unfollowUser(@PathVariable("user_id") String user_id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User currentUser = userDetails.getUser();
        User userToUnfollow = userRepository.findById(user_id)
                .orElseThrow(() -> new EntityNotFoundException("User to unfollow not found!"));
        if (currentUser.getId().equals(userToUnfollow.getId())) {
            return new ResponseEntity<>("You cannot unfollow yourself.", HttpStatus.BAD_REQUEST);
        }
        if (!currentUser.getFollowings().contains(userToUnfollow.getId())) {
            return new ResponseEntity<>("You are not following this user.", HttpStatus.BAD_REQUEST);
        }
        currentUser.getFollowings().remove(userToUnfollow.getId());
        userRepository.save(currentUser);
        userToUnfollow.getFollowers().remove(currentUser.getId());
        userRepository.save(userToUnfollow);
        //send notifications
        return new ResponseEntity<>("User unfollowed successfully.", HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<User> updateUser(@RequestBody UpdateUserRequest updateUserRequest,@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user=userService.updateUser(userDetails.getUser(), updateUserRequest);
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @PutMapping("/update-images")
    public ResponseEntity<User> updateUserImages(
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestParam(value = "coverPicture", required = false) MultipartFile coverPicture,
            @AuthenticationPrincipal UserDetailsImpl userDetails
            ) throws RuntimeException {
        User user = userService.updateUserImages(userDetails.getUser(), profilePicture, coverPicture);
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @GetMapping("/saved-posts")
    public ResponseEntity<List<Post>> getSavedPosts(@AuthenticationPrincipal UserDetailsImpl userDetails){
        List<Post> savedPosts=userService.getAllSavedPosts(userDetails.getUser());
        return new ResponseEntity<>(savedPosts,HttpStatus.OK);
    }

    @PostMapping("/saved-posts/{post_id}")
    public ResponseEntity<String> addSavedPost(
            @PathVariable("post_id") String post_id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ){
        userService.addSavedPost(userDetails.getUser(),post_id);
        return new ResponseEntity<>("post added successfully!",HttpStatus.OK);
    }

    @DeleteMapping("/saved-posts/{post_id}")
    public ResponseEntity<String> removeSavedPost(
            @PathVariable("post_id") String post_id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ){
        userService.removeSavedPost(userDetails.getUser(),post_id);
        return new ResponseEntity<>("post removed successfully!",HttpStatus.OK);
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String pattern) {
        return userService.searchUsers(pattern);
    }


}
package com.app.Echohub.Controller;


import com.app.Echohub.DTO.ImageUpdateResponseDTO;
import com.app.Echohub.DTO.PostResponseDTO;
import com.app.Echohub.DTO.Request.LogoutRequest;
import com.app.Echohub.DTO.Request.UpdateUserRequest;
import com.app.Echohub.DTO.UserDescResponse;
import com.app.Echohub.DTO.UserProfileDTO;
import com.app.Echohub.Model.Post;
import com.app.Echohub.Model.User;
import com.app.Echohub.Repository.UserRepository;
import com.app.Echohub.Security.UserDetailsImpl;
import com.app.Echohub.Service.AuthService;
import com.app.Echohub.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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

    @GetMapping("/get-me")
    public ResponseEntity<UserDescResponse> getMe(@AuthenticationPrincipal UserDetailsImpl userDetails){
        User user = userDetails.getUser();
        UserDescResponse response=UserDescResponse
                .builder()
                .id(user.getId())
                .fullname(user.getFullname())
                .profilePictureUrl(user.getProfilePictureUrl())
                .username(user.getUsername())
                .build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody LogoutRequest request) {
        String response = authService.logout(request.getRefreshToken());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileDTO> getUser(@PathVariable("userId") String userId, @AuthenticationPrincipal UserDetailsImpl userDetails){
        UserProfileDTO response=userService.getProfile(userId,userDetails.getUser().getId());
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @PostMapping("/follow/{user_id}")
    public ResponseEntity<String> followUser(@PathVariable("user_id") String user_id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String message=userService.follow(user_id,userDetails.getUser());
        return new ResponseEntity<>(message,HttpStatus.OK);
    }

    @PostMapping("/unfollow/{user_id}")
    public ResponseEntity<String> unfollowUser(@PathVariable("user_id") String user_id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String message=userService.unfollow(user_id,userDetails.getUser());
        return new ResponseEntity<>(message,HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<User> updateUser(@RequestBody UpdateUserRequest updateUserRequest,@AuthenticationPrincipal UserDetailsImpl userDetails) {
        System.out.println(updateUserRequest);
        User user=userService.updateUser(userDetails.getUser(), updateUserRequest);
        return new ResponseEntity<>(user,HttpStatus.OK);
    }

    @PostMapping("/update-images")
    public ResponseEntity<ImageUpdateResponseDTO> updateUserImages(
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestParam(value = "coverPicture", required = false) MultipartFile coverPicture,
            @AuthenticationPrincipal UserDetailsImpl userDetails
            ) throws RuntimeException {
        ImageUpdateResponseDTO response = userService.updateUserImages(userDetails.getUser(), profilePicture, coverPicture);
        System.out.println(response);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @GetMapping("/saved-posts")
    public ResponseEntity<List<PostResponseDTO>> getSavedPosts(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize) {
        System.out.println("this is me");
        List<PostResponseDTO> savedPosts = userService.getAllSavedPosts(userDetails.getUser(), page, pageSize);
        return new ResponseEntity<>(savedPosts, HttpStatus.OK);
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
    public Page<User> search(@RequestParam String pattern,
                             @RequestParam(defaultValue = "0") int page,
                             @RequestParam(defaultValue = "10") int size) {
        return userService.searchUsers(pattern, page, size);
    }


    @GetMapping("/suggest")
    public ResponseEntity<List<UserDescResponse>> suggestUsers(){
        List<UserDescResponse> users=userService.suggest();
        return new ResponseEntity<>(users,HttpStatus.OK);
    }





//    @GetMapping("/followers/{user_id}")
//    public ResponseEntity<List<User>> getFollowers(@PathVariable("user_id") String user_id) {
//        User user = userRepository.findById(user_id)
//                .orElseThrow(() -> new EntityNotFoundException("User not found!"));
//        List<User> followers = userRepository.findAllById(user.getFollowers());
//        return new ResponseEntity<>(followers, HttpStatus.OK);
//    }


//    @GetMapping("/followings/{user_id}")
//    public ResponseEntity<List<User>> getFollowings(@PathVariable("user_id") String user_id) {
//        User user = userRepository.findById(user_id)
//                .orElseThrow(() -> new EntityNotFoundException("User not found!"));
//        List<User> followings = userRepository.findAllById(user.getFollowings());
//        return new ResponseEntity<>(followings, HttpStatus.OK);
//    }


}
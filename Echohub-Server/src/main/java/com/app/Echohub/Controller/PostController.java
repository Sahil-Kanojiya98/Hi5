package com.app.Echohub.Controller;

import com.app.Echohub.Model.Post;
import com.app.Echohub.Security.UserDetailsImpl;
import com.app.Echohub.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    PostService postService;

    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "video", required = false) MultipartFile videoFile,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        Post savedPost = postService.makePost(userDetails.getUser(),content,imageFile,videoFile);
        return new ResponseEntity<>(savedPost,HttpStatus.CREATED);
    }

    @GetMapping("/{post_id}")
    public ResponseEntity<Post> getPost(@PathVariable("post_id") String post_id){
        Post post=postService.getPost(post_id);
        return new ResponseEntity<>(post,HttpStatus.OK);
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<List<Post>> getAllPost(@PathVariable("user_id") String user_id){
        List<Post> allPost=postService.getAllPost(user_id);
        return new ResponseEntity<>(allPost,HttpStatus.OK);
    }

    @DeleteMapping("/{post_id}")
    public ResponseEntity<String> deletePost(
            @PathVariable("post_id") String post_id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ){
        postService.deletePost(userDetails.getUser(),post_id);
        return new ResponseEntity<>("post deleted successfully!",HttpStatus.OK);
    }

    @PostMapping("/like/{post_id}")
    public ResponseEntity<String> likePost(
            @PathVariable("post_id") String post_id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ){
        postService.likePost(userDetails.getUser(),post_id);
        return new ResponseEntity<>("post liked",HttpStatus.OK);
    }

    @PostMapping("/unlike/{post_id}")
    public ResponseEntity<String> unlikePost(
            @PathVariable("post_id") String post_id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ){
        postService.unlikePost(userDetails.getUser(),post_id);
        return new ResponseEntity<>("post unliked",HttpStatus.OK);
    }

}

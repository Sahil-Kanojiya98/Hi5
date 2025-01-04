//package com.app.Echohub.controller;
//
//import com.app.Echohub.exceptions.EntityNotFoundException;
//import com.app.Echohub.model.Post;
//import com.app.Echohub.model.User;
//import com.app.Echohub.repository.CommentRepository;
//import com.app.Echohub.repository.PostRepository;
//import com.app.Echohub.repository.ReportRepository;
//import com.app.Echohub.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Set;
//
//@RestController
//@RequestMapping("/api/admin")
//public class AdminController {
//
//    @Autowired
//    UserRepository userRepository;
//
//    @Autowired
//    PostRepository postRepository;
//
//    @Autowired
//    CommentRepository commentRepository;
//
//    @Autowired
//    ReportRepository reportRepository;
//
//    @GetMapping("/users/count")
//    public ResponseEntity<Integer> getTotalUsers() {
//        long count = userRepository.count();
//        return ResponseEntity.ok((int) count);
//    }
//
//    @GetMapping("/posts/count")
//    public ResponseEntity<Integer> getTotalPosts() {
//        long count = postRepository.count();
//        return ResponseEntity.ok((int) count);
//    }
//
//    @DeleteMapping("/post/{postId}")
//    public ResponseEntity<String> deletePost(@PathVariable("postId") String post_id){
//        Post post = postRepository.findById(post_id).orElseThrow(() -> new EntityNotFoundException("post not found"));
//        commentRepository.deleteAllById(post.getComments());
//        User user = post.getUser();
//        user.getPosts().remove(post.getId());
//        postRepository.delete(post);
//        userRepository.save(user);
//        reportRepository.deleteAllByPostId(post_id);
//        return new ResponseEntity<>("post deleted", HttpStatus.OK );
//    }
//
//    @DeleteMapping("/user/{userId}")
//    public ResponseEntity<String> deleteUser(@PathVariable("userId") String userId){
//        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("user not found"));
//        Set<String> posts = user.getPosts();
//        List<Post> userPosts = postRepository.findAllById(posts);
//        userPosts.forEach((post)->{
//            commentRepository.deleteAllById(post.getComments());
//        });
//        postRepository.deleteAllById(posts);
//        userRepository.delete(user);
//        return new ResponseEntity<>("post deleted", HttpStatus.OK );
//    }
//
//}
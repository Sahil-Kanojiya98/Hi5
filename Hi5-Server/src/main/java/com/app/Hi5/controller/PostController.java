package com.app.Hi5.controller;


import com.app.Hi5.dto.response.PostResponse;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.PostService;
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
@RequestMapping("/api/post")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<String> createPost(@RequestParam("content") String content, @RequestParam(value = "image", required = false) MultipartFile imageFile, @RequestParam(value = "video", required = false) MultipartFile videoFile, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String body = postService.makePost(userDetails.getUser(), content, imageFile, videoFile);
        return new ResponseEntity<>(body, HttpStatus.CREATED);
    }

    @DeleteMapping("/{post_id}")
    public ResponseEntity<String> deletePost(@PathVariable("post_id") String postId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        postService.deletePost(userDetails.getUser(), postId);
        return new ResponseEntity<>("post deleted successfully!", HttpStatus.OK);
    }

    @GetMapping
    public List<PostResponse> getAllRandomPosts(@RequestParam("size") Integer size, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return postService.findRandomPosts(userDetails.getUser(), size);
    }

//    @GetMapping("/saved")
//    public List<PostResponse> getAllSavedPosts(@RequestParam(defaultValue = "0") int pageNo, @RequestParam(defaultValue = "10") int pageSize, @AuthenticationPrincipal UserDetailsImpl userDetails) {
//        return postService.findSavedPosts(userDetails.getUser(), pageNo, pageSize);
//    }
//    @GetMapping("/user/{user_id}")
//    public ResponseEntity<List<PostResponseDTO>> getUserPosts(
//            @PathVariable("user_id") String userId,
//            @AuthenticationPrincipal UserDetailsImpl userDetails,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "5") int pageSize) {
//        int skip = page * pageSize;
//        List<PostResponseDTO> posts = postRepository.findPostsByUserIdsWithPaginationAndOrder(
//                userDetails.getUser().getId(),
//                Set.of(userId),
//                skip,
//                pageSize
//        );
//        System.out.println(posts);
//        return new ResponseEntity<>(posts, HttpStatus.OK);
//    }
//    @GetMapping("/following")
//    public ResponseEntity<List<PostResponseDTO>> getFolloingsPosts(
//            @AuthenticationPrincipal UserDetailsImpl userDetails,
//            @RequestParam(defaultValue = "0") int page,   // Page number (default to 0)
//            @RequestParam(defaultValue = "5") int pageSize) { // Page size (default to 5)
//        int skip = page * pageSize;
//        List<PostResponseDTO> posts = postRepository.findPostsByUserIdsWithPaginationAndOrder(
//                userDetails.getUser().getId(),
//                userDetails.getUser().getFollowings(),
//                skip,
//                pageSize
//        );
//        return new ResponseEntity<>(posts, HttpStatus.OK);
//    }
//    @GetMapping("/{post_id}")
//    public ResponseEntity<Post> getPost(@PathVariable("post_id") String post_id){
//        Post post=postService.getPost(post_id);
//        return new ResponseEntity<>(post,HttpStatus.OK);
//    }

}
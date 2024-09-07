package com.app.Echohub.Controller;

import com.app.Echohub.DTO.PostResponseDTO;
import com.app.Echohub.Model.Post;
import com.app.Echohub.Model.User;
import com.app.Echohub.Repository.PostRepository;
import com.app.Echohub.Repository.UserRepository;
import com.app.Echohub.Security.UserDetailsImpl;
import com.app.Echohub.Service.PostService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    PostService postService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PostRepository postRepository;

    @PostMapping
    public ResponseEntity<String> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "video", required = false) MultipartFile videoFile,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        String savedPostId = postService.makePost(userDetails.getUser(),content,imageFile,videoFile);
        return new ResponseEntity<>(savedPostId,HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public List<PostResponseDTO> getAllRandomPosts(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return postService.findRandomPosts(userDetails.getUser(),10);
    }

    @GetMapping("/following")
    public ResponseEntity<List<PostResponseDTO>> getFolloingsPosts(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "0") int page,   // Page number (default to 0)
            @RequestParam(defaultValue = "5") int pageSize) { // Page size (default to 5)
        int skip = page * pageSize;
        List<PostResponseDTO> posts = postRepository.findPostsByUserIdsWithPaginationAndOrder(
                userDetails.getUser().getId(),
                userDetails.getUser().getFollowings(),
                skip,
                pageSize
        );
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<List<PostResponseDTO>> getUserPosts(
            @PathVariable("user_id") String userId,
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int pageSize) {
        int skip = page * pageSize;
        List<PostResponseDTO> posts = postRepository.findPostsByUserIdsWithPaginationAndOrder(
                userDetails.getUser().getId(),
                Set.of(userId),
                skip,
                pageSize
        );
        return new ResponseEntity<>(posts, HttpStatus.OK);
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






//    @GetMapping("/{post_id}")
//    public ResponseEntity<Post> getPost(@PathVariable("post_id") String post_id){
//        Post post=postService.getPost(post_id);
//        return new ResponseEntity<>(post,HttpStatus.OK);
//    }

}

package com.app.Echohub.Controller;

import com.app.Echohub.DTO.Request.CommentRequest;
import com.app.Echohub.Model.Comment;
import com.app.Echohub.Security.UserDetailsImpl;
import com.app.Echohub.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Set;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/{post_id}")
    public ResponseEntity<Comment> makeComment(
            @PathVariable("post_id") String post_id,
            @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ){
        Comment comments=commentService.makePostComments(userDetails.getUser(),post_id,commentRequest);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @GetMapping("/{post_id}")
    public ResponseEntity<Set<Comment>> getPostComments(@PathVariable("post_id") String post_id){
        Set<Comment> comments=commentService.getPostComments(post_id);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    @DeleteMapping("/{comment_id}")
    public ResponseEntity<String> deletePost(
            @PathVariable("comment_id") String comment_id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ){
        commentService.deleteComment(userDetails.getUser(),comment_id);
        return new ResponseEntity<>("comment deleted successfully",HttpStatus.OK);
    }

    @PostMapping("/like/{comment_id}")
    public ResponseEntity<String> likePost(
            @PathVariable("comment_id") String comment_id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ){
        commentService.likeComment(userDetails.getUser(),comment_id);
        return new ResponseEntity<>("post liked",HttpStatus.OK);
    }

    @PostMapping("/unlike/{comment_id}")
    public ResponseEntity<String> unlikePost(
            @PathVariable("comment_id") String comment_id,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ){
        commentService.unlikeComment(userDetails.getUser(),comment_id);
        return new ResponseEntity<>("post unliked",HttpStatus.OK);
    }

}

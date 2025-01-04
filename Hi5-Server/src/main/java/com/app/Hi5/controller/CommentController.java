//package com.app.Echohub.controller;
//
//import com.app.Echohub.dto.CommentResponseDTO;
//import com.app.Echohub.dto.request.CommentRequest;
//import com.app.Echohub.model.Comment;
//import com.app.Echohub.security.UserDetailsImpl;
//import com.app.Echohub.service.CommentService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//import java.nio.file.AccessDeniedException;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/comment")
//public class CommentController {
//
//    @Autowired
//    private CommentService commentService;
//
//    @PostMapping("/{post_id}")
//    public ResponseEntity<Comment> makeComment(
//            @PathVariable("post_id") String post_id,
//            @RequestBody CommentRequest commentRequest,
//            @AuthenticationPrincipal UserDetailsImpl userDetails
//    ){
//        System.out.println(commentRequest);
//        Comment comments=commentService.makePostComments(userDetails.getUser(),post_id,commentRequest);
//        return new ResponseEntity<>(comments, HttpStatus.OK);
//    }
//
//    @GetMapping("/{post_id}")
//    public List<CommentResponseDTO> getComments(
//            @PathVariable("post_id") String post_id,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "5") int pageSize,
//            @AuthenticationPrincipal UserDetailsImpl userDetails) {
//        List<CommentResponseDTO> comments = commentService.getComment(post_id, page, pageSize, userDetails.getUser());
//        System.out.println(comments);
//        return comments;
//    }
//
//    @DeleteMapping("/{comment_id}")
//    public ResponseEntity<String> deletePost(
//            @PathVariable("comment_id") String comment_id,
//            @AuthenticationPrincipal UserDetailsImpl userDetails
//    ) throws AccessDeniedException {
//        commentService.deleteComment(userDetails.getUser(),comment_id);
//        return new ResponseEntity<>("comment deleted successfully",HttpStatus.OK);
//    }
//
//
//    @PostMapping("/like/{comment_id}")
//    public ResponseEntity<String> likePost(
//            @PathVariable("comment_id") String comment_id,
//            @AuthenticationPrincipal UserDetailsImpl userDetails
//    ){
//        System.out.println("like request occure    ---------------------------------------------------------------------------:"+comment_id);
//        commentService.likeComment(userDetails.getUser(),comment_id);
//        return new ResponseEntity<>("post liked",HttpStatus.OK);
//    }
//
//    @PostMapping("/unlike/{comment_id}")
//    public ResponseEntity<String> unlikePost(
//            @PathVariable("comment_id") String comment_id,
//            @AuthenticationPrincipal UserDetailsImpl userDetails
//    ){
//        commentService.unlikeComment(userDetails.getUser(),comment_id);
//        return new ResponseEntity<>("post unliked",HttpStatus.OK);
//    }
//
//}

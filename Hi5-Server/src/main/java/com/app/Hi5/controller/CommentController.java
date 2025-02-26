package com.app.Hi5.controller;

import com.app.Hi5.dto.request.CommentRequest;
import com.app.Hi5.dto.response.CommentResponse;
import com.app.Hi5.model.Enum.CommentType;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/comment")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<String> createComment(@RequestBody CommentRequest request, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String body = commentService.makeComment(userDetails.getUser(), request.getRelevantId(), request.getType(), request.getContent());
        return new ResponseEntity<>(body, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@RequestParam("type") CommentType commentType, @RequestParam("relevantId") String relevantId, @RequestParam("page") Integer page, @RequestParam("size") Integer size, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<CommentResponse> list = commentService.getCommentList(commentType, relevantId, page, size, userDetails.getUser());
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @DeleteMapping("/{comment_id}")
    public ResponseEntity<String> deletePost(@PathVariable("comment_id") String post_id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        commentService.deleteComment(userDetails.getUser(), post_id);
        return new ResponseEntity<>("post deleted successfully!", HttpStatus.OK);
    }

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

}
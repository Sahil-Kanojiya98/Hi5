package com.app.Hi5.controller;

import com.app.Hi5.dto.request.BanUserRequest;
import com.app.Hi5.dto.response.*;
import com.app.Hi5.model.Enum.CommentType;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.CommentService;
import com.app.Hi5.service.PostService;
import com.app.Hi5.service.ReelService;
import com.app.Hi5.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/moderate")
@RequiredArgsConstructor
public class ModerationController {

    private final UserService userService;
    private final PostService postService;
    private final ReelService reelService;
    private final CommentService commentService;

    @GetMapping("/user/search/{keyword}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<UserCardResponse>> getUsersByPrefix(@PathVariable("keyword") String keyword, @RequestParam("page") Integer page, @RequestParam("size") Integer size, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<UserCardResponse> responses = userService.getUsersByKeywordForModeration(keyword, page, size, userDetails.getUser());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PatchMapping("/user/{userId}/ban")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<String> banUser(@PathVariable("userId") String userId, @RequestBody BanUserRequest request) {
        System.out.println("Ban Account:" + userId + "\nBanToDate:" + request.getBanToDate());
        return new ResponseEntity<>("user banned", HttpStatus.OK);
    }

    @PatchMapping("/user/{userId}/unban")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<String> unbanUser(@PathVariable("userId") String userId) {
        System.out.println("Ban Account:" + userId);
        return new ResponseEntity<>("user unbanned", HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<String> deleteUser(@PathVariable("userId") String userId) {
        System.out.println("Delete Account:" + userId);
        return new ResponseEntity<>("user deleted", HttpStatus.OK);
    }

    @GetMapping("/moderator")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ModeratorUserCardResponse>> getModerators() {
        List<ModeratorUserCardResponse> responses = userService.getModerators();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @DeleteMapping("/moderator/{userId}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteModerator(@PathVariable("userId") String userId) {
        System.out.println("Delete Account:" + userId);
        return new ResponseEntity<>("user deleted", HttpStatus.OK);
    }

    @GetMapping("/content/post")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedPostResponse> getReportedPosts(@RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return postService.findRandomPostsForModeration(page, size);
    }

    @GetMapping("/content/reel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedReelResponse> getReportedReels(@RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return reelService.findRandomReelsForModeration(page, size);
    }

    @GetMapping("/content/comment")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedCommentResponse> getReportedComments(@RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return commentService.getCommentListForModeration(page, size);
    }

}
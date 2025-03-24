package com.app.Hi5.controller;


import com.app.Hi5.dto.response.LikedUserCardResponse;
import com.app.Hi5.dto.response.PostResponse;
import com.app.Hi5.dto.response.ReelResponse;
import com.app.Hi5.dto.response.UserCardResponse;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.ReelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reel")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class ReelController {

    private final ReelService reelService;

    @PostMapping
    public ResponseEntity<String> createReel(@RequestParam("description") String description, @RequestParam("duration") Long duration, @RequestParam(value = "video", required = false) MultipartFile videoFile, @RequestParam("isPrivate") Boolean isPrivate, @RequestParam("isCommentsDisabled") Boolean isCommentsDisabled, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String body = reelService.makeReel(userDetails.getUser(), description, videoFile, duration, isPrivate, isCommentsDisabled);
        return new ResponseEntity<>(body, HttpStatus.CREATED);
    }

    @DeleteMapping("/{reel_id}")
    public ResponseEntity<String> deletePost(@PathVariable("reel_id") String post_id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        reelService.deleteReel(userDetails.getUser(), post_id);
        return new ResponseEntity<>("post deleted successfully!", HttpStatus.OK);
    }

    @GetMapping
    public List<ReelResponse> getAllRandomPosts(@RequestParam("size") Integer size, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return reelService.findRandomReels(userDetails.getUser(), size);
    }

    @GetMapping("/shared")
    public ReelResponse getSharedReel(@RequestParam("reelId") String reelId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return reelService.findReel(reelId, userDetails.getUser());
    }

    @GetMapping("/user/{userId}")
    public List<ReelResponse> getUserPosts(@PathVariable("userId") String userId, @RequestParam("size") Integer size, @RequestParam("page") Integer page, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return reelService.findUserReels(userId, size, page, userDetails.getUser());
    }

    @GetMapping("/saved")
    public List<ReelResponse> getUserPosts(@RequestParam("size") Integer size, @RequestParam("page") Integer page, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return reelService.findUserSavedReels(size, page, userDetails.getUser());
    }

    @GetMapping("/user/like/{reelId}")
    public List<LikedUserCardResponse> getLikedUsers(@PathVariable("reelId") String reelId, @RequestParam("size") Integer size, @RequestParam("page") Integer page, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return reelService.findLikedUsers(reelId, size, page, userDetails.getUser());
    }

}

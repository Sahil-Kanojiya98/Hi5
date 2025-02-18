package com.app.Hi5.controller;

import com.app.Hi5.dto.response.PostResponse;
import com.app.Hi5.dto.response.ReelResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.UnauthorizedAccessException;
import com.app.Hi5.model.Post;
import com.app.Hi5.model.Reel;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.PostRepository;
import com.app.Hi5.repository.ReelRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.PostService;
import com.app.Hi5.service.ReelService;
import com.app.Hi5.utility.FileStorage;
import com.app.Hi5.utility.enums.FileType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reel")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class ReelController {

    private final ReelService reelService;

    @PostMapping
    public ResponseEntity<String> createReel(@RequestParam("description") String description, @RequestParam("duration") Long duration, @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnailImageFile, @RequestParam(value = "video", required = false) MultipartFile videoFile, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String body = reelService.makeReel(userDetails.getUser(), description, thumbnailImageFile, videoFile, duration);
        return new ResponseEntity<>(body, HttpStatus.CREATED);
    }

//    @DeleteMapping("/{reel_id}")
//    public ResponseEntity<String> deletePost(@PathVariable("reel_id") String post_id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
//        reelService.deleteReel(userDetails.getUser(), post_id);
//        return new ResponseEntity<>("post deleted successfully!", HttpStatus.OK);
//    }

    @GetMapping
    public List<ReelResponse> getAllRandomPosts(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return reelService.findRandomReels(userDetails.getUser(), 10);
    }

}

package com.app.Hi5.controller;

import com.app.Hi5.dto.response.StoryResponse;
import com.app.Hi5.model.Story;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.StoryService;
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
@RequestMapping("/api/story")
@PreAuthorize("principal.isAccountNonLocked()")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @PostMapping
    public ResponseEntity<String> createStory(@RequestParam(value = "image", required = false) MultipartFile imageFile, @RequestParam(value = "video", required = false) MultipartFile videoFile, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        String body = storyService.makeStory(userDetails.getUser(), imageFile, videoFile);
        return new ResponseEntity<>(body, HttpStatus.CREATED);
    }

    @DeleteMapping("/{story_id}")
    public ResponseEntity<String> deleteStory(@PathVariable("story_id") String storyId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        storyService.deleteStory(userDetails.getUser(), storyId);
        return new ResponseEntity<>("story deleted successfully!", HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity<List<StoryResponse>> getMyActiveStorys(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<StoryResponse> response = storyService.getMyActiveStorys(userDetails.getUser());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}

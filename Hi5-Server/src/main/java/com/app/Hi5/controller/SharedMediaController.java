package com.app.Hi5.controller;

import com.app.Hi5.dto.response.PostResponse;
import com.app.Hi5.dto.response.ReelResponse;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.PostService;
import com.app.Hi5.service.ReelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequestMapping("/api/shared")
@RequiredArgsConstructor
@RestController
public class SharedMediaController {

    private final PostService postService;
    private final ReelService reelService;

    @GetMapping("/post")
    public PostResponse getSharedPost(@RequestParam("postId") String postId) {
        return postService.findPost(postId);
    }

    @GetMapping("/reel")
    public ReelResponse getSharedReel(@RequestParam("reelId") String reelId) {
        return reelService.findReel(reelId);
    }

}

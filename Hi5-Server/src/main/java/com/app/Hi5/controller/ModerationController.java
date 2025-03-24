package com.app.Hi5.controller;

import com.app.Hi5.dto.request.BanUserRequest;
import com.app.Hi5.dto.request.NewModeratorAccountRequest;
import com.app.Hi5.dto.response.*;
import com.app.Hi5.model.Enum.CommentType;
import com.app.Hi5.model.Enum.ReportReason;
import com.app.Hi5.model.Enum.ReportType;
import com.app.Hi5.security.UserDetailsImpl;
import com.app.Hi5.service.*;
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
    private final ReportService reportService;

    @GetMapping("/user/search/{keyword}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<UserCardResponse>> getUsersByPrefix(@PathVariable("keyword") String keyword, @RequestParam("page") Integer page, @RequestParam("size") Integer size, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<UserCardResponse> responses = userService.getUsersByKeywordForModeration(keyword, page, size, userDetails.getUser());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PatchMapping("/user/{userId}/ban")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<String> banUser(@PathVariable("userId") String userId, @RequestBody BanUserRequest request) {
        userService.banUser(userId,request.getBanToDate());
        return new ResponseEntity<>("user banned", HttpStatus.OK);
    }

    @PatchMapping("/user/{userId}/unban")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<String> unbanUser(@PathVariable("userId") String userId) {
        userService.unbanUser(userId);
        return new ResponseEntity<>("user unbanned", HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}/delete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<String> deleteUser(@PathVariable("userId") String userId) {
        userService.deleteUserAccount(userId);
        return new ResponseEntity<>("user deleted", HttpStatus.OK);
    }

    @GetMapping("/moderator")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ModeratorUserCardResponse>> getModerators() {
        List<ModeratorUserCardResponse> responses = userService.getModerators();
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    @PostMapping("/moderator")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addModerator(@RequestBody NewModeratorAccountRequest request) {
        userService.makeModeratorAccount(request.getEmail(), request.getUsername(), request.getPassword());
        return new ResponseEntity<>("moderator account created successfully", HttpStatus.OK);
    }

    @DeleteMapping("/moderator/{userId}/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteModerator(@PathVariable("userId") String userId) {
        userService.deleteModeratorAccount(userId);
        return new ResponseEntity<>("moderator deleted", HttpStatus.OK);
    }

    @GetMapping("/content/post")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedPostResponse> getReportedPosts(@RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return reportService.findReportedPostsForModeration(page, size);
    }

    @GetMapping("/content/reel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedReelResponse> getReportedReels(@RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return reportService.findReportedReelsForModeration(page, size);
    }

    @GetMapping("/content/comment")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedCommentResponse> getReportedComments(@RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return reportService.getReportedCommentsForModeration(page, size);
    }

    @GetMapping("/report-summary")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportDetailResponse> getReportSummary(@RequestParam("reportType") ReportType type, @RequestParam("relevantId") String relevantId) {
        return reportService.getReportCountsByTypeAndId(type, relevantId);
    }

    @GetMapping("/report-users")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public List<ReportedUserResponse> getReportUsers(@RequestParam("reportType") ReportType type, @RequestParam("relevantId") String relevantId, @RequestParam("reportReason") ReportReason reason, @RequestParam("page") Integer page, @RequestParam("size") Integer size) {
        return reportService.getReportedUsersByReason(type, relevantId, reason, page, size);
    }

}
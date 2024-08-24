package com.app.VidOrbit.Controller;

import com.app.VidOrbit.DTO.Response.MessageResponse;
import com.app.VidOrbit.Model.User;
import com.app.VidOrbit.Security.UserDetailsImpl;
import com.app.VidOrbit.Service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/video")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @PostMapping
    public ResponseEntity<MessageResponse> uploadVideo(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "video") MultipartFile videoFile,
            @RequestParam(value = "thumbnail", required = false) MultipartFile thumbnailFile,
            @RequestParam("category") String category,
            @RequestParam("status") String status,
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ){
        MessageResponse response = videoService.uploadVideo(title, description, videoFile, thumbnailFile, category, status, userDetails.getUser());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }



}

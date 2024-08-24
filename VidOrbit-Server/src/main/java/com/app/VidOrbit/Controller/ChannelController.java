package com.app.VidOrbit.Controller;

import com.app.VidOrbit.DTO.Request.CreateChannelRequest;
import com.app.VidOrbit.DTO.Request.UpdateChannelRequest;
import com.app.VidOrbit.DTO.Response.CreateChannelResponse;
import com.app.VidOrbit.DTO.Response.UpdateChannelResponse;
import com.app.VidOrbit.Model.Channel;
import com.app.VidOrbit.Security.UserDetailsImpl;
import com.app.VidOrbit.Service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/channel")
public class ChannelController {

    @Autowired
    private ChannelService channelService;

    @PostMapping
    public ResponseEntity<CreateChannelResponse> createChannel(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        CreateChannelRequest request=new CreateChannelRequest();
        request.setCategory(category);
        request.setName(name);
        request.setCoverImage(coverImage);
        request.setProfilePicture(profilePicture);
        request.setDescription(description);
        CreateChannelResponse response = channelService.createChannel(request, userDetails.getUser());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<UpdateChannelResponse> updateChannel(@RequestParam("name") String name,
                                                               @RequestParam("description") String description,
                                                               @RequestParam("category") String category,
                                                               @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
                                                               @RequestParam(value = "coverImage", required = false) MultipartFile coverImage,
                                                               @AuthenticationPrincipal UserDetailsImpl userDetails)
    {
        UpdateChannelRequest request=new UpdateChannelRequest();
        request.setCategory(category);
        request.setName(name);
        request.setCoverImage(coverImage);
        request.setProfilePicture(profilePicture);
        request.setDescription(description);
        UpdateChannelResponse response = channelService.updateChannel(request, userDetails.getUser());
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Channel> getChannelById(@PathVariable String id) {
        Channel response = channelService.getChannelById(id);
//        due to lazy loading some channel attr is not comming in the binding then
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}

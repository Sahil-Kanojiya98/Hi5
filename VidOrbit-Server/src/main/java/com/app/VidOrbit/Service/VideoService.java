package com.app.VidOrbit.Service;

import com.app.VidOrbit.DTO.Response.MessageResponse;
import com.app.VidOrbit.Model.User;
import org.springframework.web.multipart.MultipartFile;

public interface VideoService {

    MessageResponse uploadVideo(String title, String description, MultipartFile videoFile, MultipartFile thumbnailFile, String category, String status, User user);


}

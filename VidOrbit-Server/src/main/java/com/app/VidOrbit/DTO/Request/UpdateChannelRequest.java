package com.app.VidOrbit.DTO.Request;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
public class UpdateChannelRequest {
    private String name;
    private String description;
    private String category;
    private MultipartFile profilePicture;
    private MultipartFile coverImage;
}

package com.app.Echohub.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostReportPartialDTO {

    private String id;
    private String content;
    @Field("image_url")
    private String imageUrl;
    @Field("video_url")
    private String videoUrl;
    @Field("created_at")
    private LocalDateTime createdAt;
    private String username;
    private String fullname;
    private String profilePictureUrl;
    private String userID;

}
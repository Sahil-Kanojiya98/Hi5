package com.app.Echohub.DTO;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class CommentResponseDTO {
    private String commentId;
    private String content;
    @Field("created_at")
    private LocalDateTime createdAt;
    private long likeCount;
    private boolean likedFlag;
    @Field("userID")
    private String userID;
    private String userFullName;
    private String userProfilePicture;
    private String userName;
}
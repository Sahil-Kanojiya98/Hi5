//package com.app.Echohub.dto;
//
//import com.fasterxml.jackson.annotation.JsonProperty;
//import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.springframework.data.mongodb.core.mapping.Field;
//
//import java.time.LocalDateTime;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class PostResponseDTO {
//
//
////    private int likesCount;
////    private int commentsCount;
////    private boolean isLiked;
////    private boolean isSaved;
//
//    private String id;
//    private String content;
//    @Field("image_url")
//    private String imageUrl;
//    @Field("video_url")
//    private String videoUrl;
//    @Field("created_at")
//    private LocalDateTime createdAt;
//    private int likesCount;
//    private int commentsCount;
//    @Field("isLiked")
//    @JsonProperty("isLiked")
//    private boolean isLiked;
//    @Field("isReported")
//    @JsonProperty("isReported")
//    private boolean isReported;
//    @Field("isSaved")
//    @JsonProperty("isSaved")
//    private boolean isSaved;
//    private String username;
//    private String fullname;
//    private String profilePictureUrl;
//    private String userID;
//}

//package com.app.Echohub.dto;
//
//import lombok.*;
//import org.springframework.data.mongodb.core.mapping.Field;
//
//import java.time.LocalDateTime;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Getter
//@Setter
//@Builder
//public class UserProfileDTO {
//    private String id;
//    private String username;
//    private String fullname;
//    private String email;
//    @Field("profile_picture_url")
//    private String profilePictureUrl;
//    @Field("cover_picture_url")
//    private String coverPictureUrl;
//    private String bio;
//    private String link;
//    @Field("created_at")
//    private LocalDateTime createdAt;
//    private long followersCount;
//    private long followingsCount;
//    private long postsCount;
//    @Field("is_following")
//    private boolean followingFlag;
//}
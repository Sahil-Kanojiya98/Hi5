package com.app.Hi5.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "post")
public class Post {

    @Id
    private ObjectId id;

    @Field("user")
    private String userId;

    @Field("content")
    private String content;

    @Field("image_url")
    private String imageUrl;

    @Field("video_url")
    private String videoUrl;

    @CreatedDate
    @Field("created_at")
    private Date createdAt;


    @Field("likes")
    @Builder.Default
    private Set<String> likedUserIds = new LinkedHashSet<>();

    @Field("comments")
    @Builder.Default
    private Set<String> commentIds = new LinkedHashSet<>();

    @Field("reports")
    @Builder.Default
    private Set<String> reportedUsersIds = new LinkedHashSet<>();

    @Field("saved")
    @Builder.Default
    private Set<String> savedUserIds = new LinkedHashSet<>();

}
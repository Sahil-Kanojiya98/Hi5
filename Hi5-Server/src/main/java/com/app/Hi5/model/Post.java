package com.app.Hi5.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "post")
public class Post {

    @Id
    private String id;

    @Field("user")
    private String user_id;

    @Field("content")
    private String content;

    @Field("image_url")
    private String imageUrl;

    @Field("video_url")
    private String videoUrl;

    @Field("created_at")
    @CreatedDate
    private Date createdAt;

    @Field("likes")
    @Builder.Default
    private Set<String> likes = new HashSet<>();

    @Field("comments")
    @Builder.Default
    private Set<String> comments = new HashSet<>();

    @Field("reported_by_users")
    @Builder.Default
    private Set<String> reportedByUsers = new HashSet<>();

    @Field("saved_by_users")
    @Builder.Default
    private Set<String> savedByUsers = new HashSet<>();

}

package com.app.Echohub.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    @DBRef
    @Field("user_id")
    @Indexed
    private User user;

    private String content;

    @Field("image_url")
    private String imageUrl;

    @Field("video_url")
    private String videoUrl;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("modified_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Field("likes_count")
    private int likesCount = 0;

    @DBRef(lazy = true)
    @Builder.Default
    @JsonIgnore
    private Set<String> likes = new HashSet<>();

    @Field("comments_count")
    private int commentsCount = 0;

    @DBRef(lazy = true)
    @Builder.Default
    @JsonIgnore
    private Set<Comment> comments = new HashSet<>();

}

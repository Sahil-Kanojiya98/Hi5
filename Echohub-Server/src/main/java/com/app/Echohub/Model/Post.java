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
    @JsonIgnore
    private LocalDateTime updatedAt;

    @Builder.Default
    @JsonIgnore
    private Set<String> likes = new HashSet<>();

    @Builder.Default
    @JsonIgnore
    private Set<String> comments = new HashSet<>();

    @Field("saved_by_users")
    @Builder.Default
    @JsonIgnore
    private Set<String> savedByUsers = new HashSet<>();

}

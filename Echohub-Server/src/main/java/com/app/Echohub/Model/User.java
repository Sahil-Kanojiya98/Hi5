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
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String fullname;

    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    @Field("profile_picture_url")
    private String profilePictureUrl;

    @Field("cover_picture_url")
    private String coverPictureUrl;

    private String bio;

    private String link;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("modified_at")
    @LastModifiedDate
    @JsonIgnore
    private LocalDateTime updatedAt;

    @DBRef(lazy = true)
    @Builder.Default
    @Field("refresh_token")
    @JsonIgnore
    private List<RefreshToken> refreshToken=new LinkedList<>();

    @Builder.Default
    @JsonIgnore
    private Set<String> followers=new HashSet<>();

    @Builder.Default
    @JsonIgnore
    private Set<String> followings=new HashSet<>();

    @Builder.Default
    @JsonIgnore
    private Set<String> posts=new HashSet<>();

    @Field("saved_posts")
    @Builder.Default
    @JsonIgnore
    private Set<String> savedPosts=new HashSet<>();

    @JsonIgnore
    @Builder.Default
    @Field("roles")
    private Set<String> roles = new HashSet<>();

}
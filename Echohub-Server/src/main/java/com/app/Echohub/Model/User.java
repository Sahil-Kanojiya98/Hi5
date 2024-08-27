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
import java.util.LinkedList;
import java.util.List;

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

    private String password;

    @Field("profile_picture_url")
    private String profilePictureUrl;

    private String bio;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("modified_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    private String status; // active, banned, etc.

    //pro subscription

    @DBRef(lazy = true)
    @Builder.Default
    @Field("refresh_token")
    @JsonIgnore
    private List<RefreshToken> refreshToken=new LinkedList<>();

}


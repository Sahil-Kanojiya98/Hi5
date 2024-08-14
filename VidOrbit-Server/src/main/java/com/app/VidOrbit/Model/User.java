package com.app.VidOrbit.Model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
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

    private String username;

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
    private Channel channel;

    @DBRef(lazy = true)
    private List<Subscription> subscribedChannels;

    @DBRef(lazy = true)
    private List<Video> history;

    @DBRef(lazy = true)
    private List<Playlist> savedPlaylists;

    @DBRef(lazy = true)
    private List<Video> likedVideos;

    @DBRef(lazy = true)
    private List<Subscription> subscriptions;

    @DBRef(lazy = true)
    private List<Report> reportHistory;

}


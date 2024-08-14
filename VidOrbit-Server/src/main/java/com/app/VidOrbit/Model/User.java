package com.app.VidOrbit.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;
    private String email;
    private String password;
    private String profilePictureUrl;
    private String bio;
    private LocalDateTime createdAt;
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


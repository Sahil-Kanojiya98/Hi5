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
@Document(collection = "videos")
public class Video {

    @Id
    private String id;

    @DBRef(lazy = true)
    private User user;

    @DBRef(lazy = true)
    private Channel channel;

    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private int duration;

    @DBRef(lazy = true)
    private List<Tag> tags;

    private Category category;

    @DBRef(lazy = true)
    private List<Comment> comments;

    @DBRef(lazy = true)
    private List<Reaction> likes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status; // public, private, unlisted

    @DBRef(lazy = true)
    private VideoAnalytics videoAnalytics;

}



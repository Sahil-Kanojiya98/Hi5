package com.app.VidOrbit.Model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "videos")
@Builder
public class Video {

    @Id
    private String id;

    @DBRef(lazy = true)
    private Channel channel;

    private String title;
    private String description;

    @Field("thumbnail_url")
    private String thumbnailUrl;

    private int duration;

    @DBRef(lazy = true)
    @Builder.Default
    private List<Tag> tags=new LinkedList<>();

    @Builder.Default
    private Category category=Category.OTHER;

    @DBRef(lazy = true)
    @Builder.Default
    private List<Comment> comments=new LinkedList<>();

    @DBRef(lazy = true)
    @Builder.Default
    private List<Reaction> likes=new LinkedList<>();

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    private String status; // public, private, unlisted

    @DBRef(lazy = true)
    @Field("video_analytics")
    private VideoAnalytics videoAnalytics;

}
package com.app.VidOrbit.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
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
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "channels")
@Builder
public class Channel {

    @Id
    private String id;

    @DBRef(lazy = true)
    @JsonIgnore
    private User user;
    private String name;
    private String description;
    private Category category;

    @Field("profile_picture_url")
    private String profilePictureUrl;

    @Field("cover_image_url")
    private String coverImageUrl;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @DBRef(lazy = true)
    @Builder.Default
    @JsonIgnore
    private List<Video> videos=new LinkedList<>();

    @DBRef(lazy = true)
    @Builder.Default
    @JsonIgnore
    private List<Playlist> playlists=new LinkedList<>();

    @Field("subscribers_count")
    private int subscribersCount;

    @DBRef(lazy = true)
    @Builder.Default
    @JsonIgnore
    private List<Subscription> subscribers=new LinkedList<>();

}

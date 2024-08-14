package com.app.VidOrbit.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "video_analytics")
public class VideoAnalytics {

    @Id
    @DBRef(lazy = true)
    private Video video;

    private int views;
    private int likes;
    private int dislikes;
    private int comments;
    private int watchTime;

}

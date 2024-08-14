package com.app.VidOrbit.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "ads")
public class Ad {
    @Id
    private String id;
    @DBRef(lazy = true)
    private Advertiser advertiser;
    private String title;
    private String contentUrl;
    private String targetAudience; // Demographics, interests
    private double budget;
    private LocalDateTime createdAt;
}
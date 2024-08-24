package com.app.VidOrbit.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    @DBRef(lazy = true)
    private User user;

    private String type; // New Video From Subscribed Channel, Comment, Reply, etc

    private String content;

    private String link;

    @Field("is_read")
    private boolean isRead;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

}

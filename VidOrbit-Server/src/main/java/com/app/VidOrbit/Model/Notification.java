package com.app.VidOrbit.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    @DBRef(lazy = true)
    private User user;

    private String type; // new video, comment, reply, etc.

    private String content;

    private String link;

    private boolean isRead;

    private LocalDateTime createdAt;

}

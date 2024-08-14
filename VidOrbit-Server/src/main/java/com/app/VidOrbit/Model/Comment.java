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
@Document(collection = "comments")
public class Comment {
    @Id
    private String id;

    @DBRef(lazy = true)
    private Video video;

    @DBRef(lazy = true)
    private User user;

    private String content;

    @DBRef(lazy = true)
    private List<Comment> subComments;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likesCount;
    private int dislikesCount;

}

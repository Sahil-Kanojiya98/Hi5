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
@Builder
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
    @Builder.Default
    @Field("sub_comments")
    private List<Comment> subComments=new LinkedList<>();

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Field("likes_count")
    private int likesCount;

    @Field("dislikes_count")
    private int dislikesCount;

}

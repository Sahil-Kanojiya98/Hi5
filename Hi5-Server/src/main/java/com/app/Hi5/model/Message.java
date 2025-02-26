package com.app.Hi5.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "messages")
public class Message {

    @Id
    private ObjectId id;

    @Field("chat")
    private String chatId;

    @Field("image_url")
    private String imageUrl;

    @Field("video_url")
    private String videoUrl;

    @Field("message")
    private String message;

    @Field("created_by_user")
    private String createdByUserId;

    @CreatedDate
    @Field("created_at")
    private Date createdAt;

}
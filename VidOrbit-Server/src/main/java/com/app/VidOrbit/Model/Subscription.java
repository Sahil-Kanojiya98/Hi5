package com.app.VidOrbit.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.checkerframework.checker.units.qual.C;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "subscriptions")
public class Subscription {

    @Id
    private String id;

    @DBRef(lazy = true)
    private User user;

    @DBRef(lazy = true)
    private Channel channel;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

}
package com.app.Hi5.model;

import com.app.Hi5.model.Enum.LikeType;
import com.app.Hi5.model.Enum.SaveType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "like")
public class Like {

    @Id
    private ObjectId id;

    @Field("user")
    private String userId;

    @Field("relevant")
    private String relevantId;

    @Field("type")
    private LikeType likeType;

    @Field("is_liked")
    private Boolean isLiked;

    @LastModifiedDate
    @Field("created_at")
    private Date createdAt;

}
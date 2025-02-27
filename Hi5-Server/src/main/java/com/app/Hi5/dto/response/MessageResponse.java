package com.app.Hi5.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;


import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private String id;

    private String chatId;

    private String imageUrl;

    private String videoUrl;

    private String message;

    private String senderUserId;

    private String receiverUserId;

    private Date createdAt;

}

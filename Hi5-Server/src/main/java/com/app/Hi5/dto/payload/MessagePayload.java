package com.app.Hi5.dto.payload;

import com.app.Hi5.model.Message;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessagePayload {

    private String chatId;

    private String imageUrl;

    private String videoUrl;

    private String message;

    private String senderUserId;

    private String receiverUserId;

}

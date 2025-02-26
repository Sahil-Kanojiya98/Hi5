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
public class StoryResponse {

    private String id;
    private String imageUrl;
    private String videoUrl;
    private Date createdAt;
    private Integer likeCount;

}
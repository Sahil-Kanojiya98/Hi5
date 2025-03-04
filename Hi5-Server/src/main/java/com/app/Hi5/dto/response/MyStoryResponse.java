package com.app.Hi5.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyStoryResponse {

    private String id;
    private String imageUrl;
    private String videoUrl;
    private Date createdAt;
    private Integer likeCount;

}
package com.app.Hi5.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportedPostResponse {

    private String id;
    private String userId;
    private String content;
    private String imageUrl;
    private String videoUrl;
    private Date createdAt;
    private Integer likesCount;
    private Integer commentsCount;

    @JsonProperty("isPrivate")
    private Boolean isPrivate;

    @JsonProperty("isCommentsDisabled")
    private Boolean isCommentsDisabled;

    private String username;
    private String fullname;
    private String profilePictureUrl;

}

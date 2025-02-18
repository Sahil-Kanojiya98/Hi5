package com.app.Hi5.dto.response;

import com.app.Hi5.dto.enums.FollowStatus;
import com.app.Hi5.dto.enums.LikeStatus;
import com.app.Hi5.dto.enums.ReportStatus;
import com.app.Hi5.dto.enums.SaveStatus;
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
public class ReelResponse {

    private String id;

    private String description;
    private String thumbnailUrl;
    private String videoUrl;
    private Date createdAt;

    @JsonProperty("likeStatus")
    private LikeStatus likeStatus;
    private Integer likesCount;

    private Integer commentsCount;

    @JsonProperty("reportStatus")
    private ReportStatus reportStatus;

    @JsonProperty("saveStatus")
    private SaveStatus saveStatus;

    @JsonProperty("followStatus")
    private FollowStatus followStatus;

    private String userId;
    private String username;
    private String fullname;
    private String profilePictureUrl;

}
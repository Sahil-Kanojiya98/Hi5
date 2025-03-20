package com.app.Hi5.dto.response;

import com.app.Hi5.dto.enums.LikeStatus;
import com.app.Hi5.dto.enums.ReportStatus;
import com.app.Hi5.model.Enum.CommentType;
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
public class ReportedCommentResponse {

    private String id;
    private String relevantId;
    private CommentType type;
    private String userId;
    private String username;
    private String fullname;
    private String profilePictureUrl;
    private String content;
    private Date createdAt;
    private Integer likesCount;
    private ReportedPostResponse postResponse;
    private ReportedReelResponse reelResponse;

}

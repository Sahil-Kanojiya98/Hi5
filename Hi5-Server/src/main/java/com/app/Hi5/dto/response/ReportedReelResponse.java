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
public class ReportedReelResponse {

    private String id;
    private String reelId;
    private String userId;
    private String description;
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
    private Date banUntil;

    private Long totalReportsCount;

}

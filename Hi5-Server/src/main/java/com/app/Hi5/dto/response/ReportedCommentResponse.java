package com.app.Hi5.dto.response;

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
    private String commentId;
    private String relevantId;
    private CommentType type;
    private String userId;
    private String username;
    private String fullname;
    private String profilePictureUrl;
    private String content;
    private Date createdAt;
    private Integer likesCount;
    private CommentTypePostResponse postResponse;
    private CommentTypeReelResponse reelResponse;
    private Long totalReportsCount;

    @Data
    public static class CommentTypePostResponse {
        private String id;
        private String postId;
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

    @Data
    public static class CommentTypeReelResponse {
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
    }
}

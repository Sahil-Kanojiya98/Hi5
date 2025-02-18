package com.app.Hi5.dto.response;

import com.app.Hi5.dto.enums.LikeStatus;
import com.app.Hi5.dto.enums.ReportStatus;
import com.app.Hi5.dto.enums.SaveStatus;
import com.app.Hi5.model.Enum.CommentType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
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
@Builder
public class CommentResponse {

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

    @JsonProperty("likeStatus")
    private LikeStatus likeStatus;

    @JsonProperty("reportStatus")
    private ReportStatus reportStatus;

}

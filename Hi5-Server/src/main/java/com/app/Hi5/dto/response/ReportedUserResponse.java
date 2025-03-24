package com.app.Hi5.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportedUserResponse {

    private String userId;
    private String username;
    private String fullname;
    private String profilePictureUrl;
    private Date reportedAt;

}
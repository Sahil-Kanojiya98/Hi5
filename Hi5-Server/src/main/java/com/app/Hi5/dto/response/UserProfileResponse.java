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
public class UserProfileResponse {

    private String id;
    private String username;
    private String fullname;
    private String email;
    private String profilePictureUrl;
    private String coverPictureUrl;
    private String bio;
    private String link;
    private Date createdAt;
    private Long followersCount;
    private Long followingsCount;
    private Long postsCount;
    private Boolean followingFlag;

}
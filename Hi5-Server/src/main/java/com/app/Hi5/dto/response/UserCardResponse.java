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
public class UserCardResponse {

    private String id;
    private String username;
    private String fullname;
    private String profilePictureUrl;
    private Date banUntil;

}

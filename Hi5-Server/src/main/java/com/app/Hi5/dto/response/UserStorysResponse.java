package com.app.Hi5.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStorysResponse {

    private String id;
    private String fullname;
    private String profilePictureUrl;
    private List<StoryResponse> storys;

}

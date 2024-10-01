package com.app.Echohub.DTO;

import lombok.*;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserDescResponse {
    private String id;
    private String username;
    private String fullname;
    @Field("profile_picture_url")
    private String profilePictureUrl;
    private Set<String> roles;
}
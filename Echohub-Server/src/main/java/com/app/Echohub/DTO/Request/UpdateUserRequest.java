package com.app.Echohub.DTO.Request;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    private String fullName;
    private String email;
    private String currentPassword;
    private String link;
    private String username;
    private String bio;
    private String newPassword;
}

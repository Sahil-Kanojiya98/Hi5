package com.app.Echohub.DTO.Request;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthTokenRefereshRequest {

    private String refreshToken;

}

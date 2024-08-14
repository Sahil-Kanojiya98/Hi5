package com.app.VidOrbit.DTO.Response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterResponse {

    private String token;
    private LocalDateTime createdAt;

}
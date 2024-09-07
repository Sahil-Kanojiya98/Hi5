package com.app.Echohub.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ImageUpdateResponseDTO {

    private String profilePictureUrl;
    private String coverPictureUrl;

}

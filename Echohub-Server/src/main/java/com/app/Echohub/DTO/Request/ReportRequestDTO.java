package com.app.Echohub.DTO.Request;

import com.app.Echohub.Model.ReportReason; // Import the ReportReason enum
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequestDTO {

    private String postId;
    private ReportReason reason;

}

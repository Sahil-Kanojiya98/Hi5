package com.app.Hi5.dto.response;

import com.app.Hi5.model.Enum.ReportReason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportDetailResponse {
    private ReportReason reason;
    private Long count;
}

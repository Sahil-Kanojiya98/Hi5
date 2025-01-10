package com.app.Hi5.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckEmailAvailabilityResponse {

    private boolean isAvailable;
    private HttpStatus status;
    private int statusCode;
    private String message;

    public ResponseEntity<CheckEmailAvailabilityResponse> toResponseEntity() {
        return new ResponseEntity<>(this, this.status);
    }

}

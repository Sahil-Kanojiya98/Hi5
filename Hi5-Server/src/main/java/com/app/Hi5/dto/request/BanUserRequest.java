package com.app.Hi5.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BanUserRequest {

    @NotNull(message = "Date of Birth cannot be null or blank")
    @Future(message = "Date must be in the future")
    private Date banToDate;

}

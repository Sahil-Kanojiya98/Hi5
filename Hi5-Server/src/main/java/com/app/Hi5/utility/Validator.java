package com.app.Hi5.utility;

import com.app.Hi5.exceptions.ValidationException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class Validator {

    private Validator() {
    }

    public static void validateEmailOrUsername(String email, String username) throws ValidationException {
        log.info("Validating email or username: email = {}, username = {}", email, username);

        if (username != null && email != null) {
            log.warn("Both email and username are provided. Only one is allowed.");
            throw new ValidationException("Either username or email must be provided, Both not accepted.");
        }

        if (username == null) {
            if (email == null) {
                log.warn("Neither username nor email is provided.");
                throw new ValidationException("Either username or email must be provided.");
            }
            if (email.isBlank()) {
                log.warn("Email is blank.");
                throw new ValidationException("Email cannot be blank.");
            }

            if (!email.matches("^[\\w-.]+@[\\w-]+(?:\\.[a-zA-Z]{2,})+$")) {
                log.warn("Invalid email format: {}", email);
                throw new ValidationException("Invalid email format.");
            }
        } else {
            if (username.isBlank()) {
                log.warn("Username is blank.");
                throw new ValidationException("Username cannot be blank.");
            }
        }

        log.info("Validation passed for email = {}, username = {}", email, username);
    }
}

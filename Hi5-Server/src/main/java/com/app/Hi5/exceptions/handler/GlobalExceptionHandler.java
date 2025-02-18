package com.app.Hi5.exceptions.handler;

import com.app.Hi5.dto.response.ErrorResponse;
import com.app.Hi5.exceptions.*;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.security.InvalidKeyException;
import io.jsonwebtoken.security.SignatureException;
import io.jsonwebtoken.security.WeakKeyException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.mail.MailSendException;
import org.springframework.messaging.MessagingException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({InsufficientAuthenticationException.class})
    public ResponseEntity<ErrorResponse> handleInsufficientAuthenticationException(RuntimeException e) {
        log.warn("InsufficientAuthenticationException occured: {}", e.getMessage(), e);
        return ErrorResponse.builder().status(HttpStatus.FORBIDDEN).statusCode(HttpStatus.FORBIDDEN.value()).message("Insufficient Authentication error!").build().toResponseEntity();
    }

    @ExceptionHandler({UsernameNotFoundException.class, BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleUsernameNotFoundOrBadCredentialsException(RuntimeException e) {
        log.warn("UsernameNotFoundException occurred: {}", e.getMessage(), e);
        if (e instanceof UsernameNotFoundException) {
            return ErrorResponse.builder().status(HttpStatus.BAD_REQUEST).statusCode(HttpStatus.BAD_REQUEST.value()).message(e.getMessage()).build().toResponseEntity();
        } else {
            return ErrorResponse.builder().status(HttpStatus.BAD_REQUEST).statusCode(HttpStatus.BAD_REQUEST.value()).message("Either email/username or password is invalid!").build().toResponseEntity();
        }
    }

    @ExceptionHandler({InvalidOtpException.class})
    public ResponseEntity<ErrorResponse> handleInvalidOtpException(RuntimeException e) {
        log.warn("InvalidOtpException occurred: {}", e.getMessage(), e);
        return ErrorResponse.builder().status(HttpStatus.BAD_REQUEST).statusCode(HttpStatus.BAD_REQUEST.value()).message(e.getMessage()).build().toResponseEntity();
    }

    @ExceptionHandler({EntityNotFoundException.class})
    public ResponseEntity<ErrorResponse> handleBadRequestException(RuntimeException e) {
        log.error("Bad Request: {}", e.getMessage(), e);
        return ErrorResponse.builder().status(HttpStatus.BAD_REQUEST).statusCode(HttpStatus.BAD_REQUEST.value()).message(e.getMessage()).build().toResponseEntity();
    }

    @ExceptionHandler({EntityAlreadyExistsException.class})
    public ResponseEntity<ErrorResponse> handleEntityAlreadyExistsException(RuntimeException e) {
        log.warn("EntityAlreadyExistsException occurred: {}", e.getMessage(), e);
        return ErrorResponse.builder().status(HttpStatus.BAD_REQUEST).statusCode(HttpStatus.BAD_REQUEST.value()).message(e.getMessage()).build().toResponseEntity();
    }

    @ExceptionHandler({UnauthorizedAccessException.class})
    public ResponseEntity<ErrorResponse> handleUnauthorizedAccessException(RuntimeException e) {
        log.warn("UnauthorizedAccessException occurred: {}", e.getMessage(), e);
        return ErrorResponse.builder().status(HttpStatus.BAD_REQUEST).statusCode(HttpStatus.BAD_REQUEST.value()).message(e.getMessage()).build().toResponseEntity();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException e) {
        if (e.getBindingResult().hasErrors()) {
            String message = e.getBindingResult().getAllErrors().getFirst().getDefaultMessage();
            log.warn("Validation exception occurred: {}", message, e);
            return ErrorResponse.builder().status(HttpStatus.BAD_REQUEST).statusCode(HttpStatus.BAD_REQUEST.value()).message(message).build().toResponseEntity();
        }
        log.warn("Validation errors occurred: {}", e.getMessage());
        return ErrorResponse.builder().status(HttpStatus.BAD_REQUEST).statusCode(HttpStatus.BAD_REQUEST.value()).message("Invalid request").build().toResponseEntity();
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException e) {
        log.warn("Validation exception occurred :", e);
        return ErrorResponse.builder().status(HttpStatus.BAD_REQUEST).statusCode(HttpStatus.BAD_REQUEST.value()).message(e.getMessage()).build().toResponseEntity();
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException e) {
        log.warn("Http message not readable exception occurred: {}", e.getMessage());
        return ErrorResponse.builder().status(HttpStatus.BAD_REQUEST).statusCode(HttpStatus.BAD_REQUEST.value()).message(e.getLocalizedMessage()).build().toResponseEntity();
    }

    @ExceptionHandler({ExpiredJwtException.class, UnsupportedJwtException.class, MalformedJwtException.class, SignatureException.class, IllegalArgumentException.class})
    public ResponseEntity<ErrorResponse> jwtDecodeException(RuntimeException e) {
        String message;
        if (e instanceof ExpiredJwtException) {
            message = "The provided JWT token has expired. Please login again to obtain a new token.";
        } else if (e instanceof UnsupportedJwtException) {
            message = "The provided JWT token is unsupported. Ensure you are using a valid token.";
        } else if (e instanceof MalformedJwtException) {
            message = "The provided JWT token is malformed. Please check the token format.";
        } else if (e instanceof SignatureException) {
            message = "JWT token signature is invalid. The token may have been tampered with.";
        } else if (e instanceof IllegalArgumentException) {
            message = "An error occurred while processing the JWT token. The token may be empty or invalid.";
        } else {
            message = "An unknown error occurred while processing the JWT token.";
        }
        log.warn("JWT decoding exception occurred: {}", message, e);
        return ErrorResponse.builder().status(HttpStatus.UNAUTHORIZED).statusCode(HttpStatus.UNAUTHORIZED.value()).message(message).build().toResponseEntity();
    }

    @ExceptionHandler(MailSendException.class)
    public ResponseEntity<ErrorResponse> handleMailSendException(RuntimeException e) {
        log.warn("Mail send exception occurred: {}", e.getMessage(), e);
        return ErrorResponse.builder().status(HttpStatus.INTERNAL_SERVER_ERROR).statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()).message(e.getLocalizedMessage()).build().toResponseEntity();
    }

    @ExceptionHandler({MessagingException.class})
    public void handleMessagingException(Exception e) {
        log.warn("Messaging exception occurred: {}", e.getMessage(), e);
    }

    @ExceptionHandler({DecodingException.class, WeakKeyException.class, InvalidKeyException.class})
    public void handleDecodingException(Exception e) {
        log.warn("Key-related exception occurred: {}", e.getMessage(), e);
    }

    @ExceptionHandler(OAuth2AuthenticationProcessingException.class)
    public void OAuth2AuthenticationProcessingException(RuntimeException e) {
        log.warn(e.getMessage());
    }

//    @ExceptionHandler({
//            AccessDeniedException.class,
//            InvalidOrExpiredTokenException.class
//    })
//    public ResponseEntity<String> handleForbiddenException(RuntimeException ex) {
//        logger.error("Forbidden: {}", ex.getMessage(), ex);
//        return new ResponseEntity<>("Access Denied: " + ex.getMessage(), HttpStatus.FORBIDDEN);
//    }
//
//    @ExceptionHandler({
//            EntityAlreadyExistsException.class,
//            IllegalStateException.class
//    })
//    public ResponseEntity<String> handleConflictException(RuntimeException ex) {
//        logger.error("Conflict: {}", ex.getMessage(), ex);
//        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
//    }
//
//    @ExceptionHandler({
//            ExpiredJwtException.class,
//            ClaimJwtException.class,
//            JwtException.class
//    })
//    public ResponseEntity<String> handleUnauthorizedAccessException(RuntimeException ex) {
//        logger.error("Unauthorized Access: {}", ex.getMessage(), ex);
//        return new ResponseEntity<>("Unauthorized Access", HttpStatus.UNAUTHORIZED);
//    }
//
//    @ExceptionHandler(
//            Exception.class
//    )
//    public ResponseEntity<String> handleGlobalException(Exception ex) {
//        logger.error("Internal Server Error: {}", ex.getMessage(), ex);
//        return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//
//    @ExceptionHandler(
//            Throwable.class
//    )
//    public ResponseEntity<String> handleThrowable(Throwable th) {
//        logger.error("Critical Error: {}", th.getMessage(), th);
//        return new ResponseEntity<>("A critical error occurred: ",HttpStatus.INTERNAL_SERVER_ERROR);
//    }


    // Handle generic exceptions
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ProblemDetail> handleGenericException(Exception ex, WebRequest request) {
//        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
//                HttpStatus.INTERNAL_SERVER_ERROR,
//                ex.getMessage()
//        );
//        problemDetail.setTitle("Internal Server Error");
//        problemDetail.setType(URI.create("https://example.com/internal-server-error"));
//        problemDetail.setInstance(URI.create(request.getDescription(false)));
//
//        return ResponseEntity
//                .status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(problemDetail);
//    }
//
    // Handle specific custom exceptions
//    @ExceptionHandler(ResourceNotFoundException.class)
//    public ResponseEntity<ProblemDetail> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
//        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
//                HttpStatus.NOT_FOUND,
//                ex.getMessage()
//        );
//        problemDetail.setTitle("Resource Not Found");
//        problemDetail.setType(URI.create("https://example.com/resource-not-found"));
//        problemDetail.setInstance(URI.create(request.getDescription(false)));
//
//        return ResponseEntity
//                .status(HttpStatus.NOT_FOUND)
//                .body(problemDetail);
//    }
//
//    // Handle validation-related exceptions
//    @ExceptionHandler(IllegalArgumentException.class)
//    public ResponseEntity<ProblemDetail> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
//        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
//                HttpStatus.BAD_REQUEST,
//                ex.getMessage()
//        );
//        problemDetail.setTitle("Invalid Request");
//        problemDetail.setType(URI.create("https://example.com/bad-request"));
//        problemDetail.setInstance(URI.create(request.getDescription(false)));
//
//        return ResponseEntity
//                .status(HttpStatus.BAD_REQUEST)
//                .body(problemDetail);
//    }

}
package com.app.VidOrbit.Exceptions.Handler;

import com.app.VidOrbit.DTO.Response.ErrorResponse;
import com.app.VidOrbit.Exceptions.*;
import io.jsonwebtoken.ClaimJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity<ErrorResponse> handleForbiddenException(AccessDeniedException ex) {
        logger.error("Forbidden: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ErrorResponse.builder().error("Access Denied: " + ex.getMessage()).build(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({
            InvalidUsernameOrPasswordException.class,
            ResourceNotFoundException.class,
            EntityNotFoundException.class
    })
    public ResponseEntity<ErrorResponse> handleBadRequestException(RuntimeException ex) {
        logger.error("Bad Request: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ErrorResponse.builder().error(ex.getMessage()).build(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({EntityAlreadyExistsException.class})
    public ResponseEntity<ErrorResponse> handleConflictException(EntityAlreadyExistsException ex) {
        logger.error("Conflict: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ErrorResponse.builder().error(ex.getMessage()).build(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler({ExpiredJwtException.class, ClaimJwtException.class, JwtException.class})
    public ResponseEntity<ErrorResponse> handleUnauthorizedAccessException(RuntimeException ex) {
        logger.error("Unauthorized Access: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ErrorResponse.builder().error("Unauthorized: " + ex.getMessage()).build(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        logger.error("Internal Server Error: {}", ex.getMessage(), ex);
        return new ResponseEntity<>(ErrorResponse.builder().error("An unexpected error occurred: " + ex.getMessage()).build(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<ErrorResponse> handleThrowable(Throwable th) {
        logger.error("Critical Error: {}", th.getMessage(), th);
        return new ResponseEntity<>(ErrorResponse.builder().error("A critical error occurred: " + th.getMessage()).build(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

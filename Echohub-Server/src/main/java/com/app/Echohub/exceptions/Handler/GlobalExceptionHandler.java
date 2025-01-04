//package com.app.Echohub.exceptions.Handler;
//
//import com.app.Echohub.exceptions.*;
//import io.jsonwebtoken.ClaimJwtException;
//import io.jsonwebtoken.ExpiredJwtException;
//import io.jsonwebtoken.JwtException;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.AccessDeniedException;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//@ControllerAdvice
//public class GlobalExceptionHandler {
//
//    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
//
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
//            InvalidUsernameOrPasswordException.class,
//            EntityNotFoundException.class,
//            IllegalAccessException.class
//    })
//    public ResponseEntity<String> handleBadRequestException(RuntimeException ex) {
//        logger.error("Bad Request: {}", ex.getMessage(), ex);
//        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
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
//
//}
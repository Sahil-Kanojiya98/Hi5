package com.app.VidOrbit.Exceptions.Handler;

import com.app.VidOrbit.DTO.Response.ErrorResponse;
import com.app.VidOrbit.Exceptions.InvalidOrExpiredTokenException;
import com.app.VidOrbit.Exceptions.InvalidUsernameOrPasswordException;
import com.app.VidOrbit.Exceptions.UserNotFoundException;
import com.app.VidOrbit.Exceptions.UsernameAlreadyExistsException;
import io.jsonwebtoken.ClaimJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ErrorResponse> forbidden(AuthorizationDeniedException ex){
        return new ResponseEntity<>(ErrorResponse.builder().error(ex.getMessage()).build(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({UsernameAlreadyExistsException.class,InvalidUsernameOrPasswordException.class,UserNotFoundException.class})
    public ResponseEntity<ErrorResponse> badRequest(RuntimeException ex) {
        return new ResponseEntity<>(ErrorResponse.builder().error(ex.getMessage()).build(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ClaimJwtException.class, JwtException.class})
    public ResponseEntity<ErrorResponse> unauthorizedAccess(RuntimeException ex){
        return new ResponseEntity<>(ErrorResponse.builder().error(ex.getMessage()).build(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Throwable th) {
        return new ResponseEntity<>(ErrorResponse.builder().error(th.getMessage()).build(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

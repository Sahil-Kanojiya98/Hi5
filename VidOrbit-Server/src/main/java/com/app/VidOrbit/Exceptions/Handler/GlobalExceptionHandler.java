package com.app.VidOrbit.Exceptions.Handler;

import com.app.VidOrbit.DTO.Response.ErrorResponse;
import com.app.VidOrbit.Exceptions.InvalidUsernameOrPasswordException;
import com.app.VidOrbit.Exceptions.UserNotFoundException;
import com.app.VidOrbit.Exceptions.UsernameAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException ex) {
        return new ResponseEntity<>(ErrorResponse.builder().error(ex.getMessage()).build(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidUsernameOrPasswordException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUsernameOrPasswordException(InvalidUsernameOrPasswordException ex) {
        return new ResponseEntity<>(ErrorResponse.builder().error(ex.getMessage()).build(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(UserNotFoundException ex) {
        return new ResponseEntity<>(ErrorResponse.builder().error(ex.getMessage()).build(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Throwable.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Throwable th) {
        return new ResponseEntity<>(ErrorResponse.builder().error(th.getMessage()).build(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

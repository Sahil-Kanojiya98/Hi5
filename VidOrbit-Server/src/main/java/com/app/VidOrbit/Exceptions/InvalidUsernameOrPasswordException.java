package com.app.VidOrbit.Exceptions;

public class InvalidUsernameOrPasswordException extends RuntimeException {

    public InvalidUsernameOrPasswordException() {
        super("Invalid username or password");
    }

    public InvalidUsernameOrPasswordException(String message) {
        super(message);
    }

}
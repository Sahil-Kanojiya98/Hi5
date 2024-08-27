package com.app.Echohub.Exceptions;


public class InvalidOrExpiredTokenException extends RuntimeException {

    public InvalidOrExpiredTokenException() {
        super("Invalid or expired refresh token");
    }

    public InvalidOrExpiredTokenException(String message) {
        super(message);
    }
}

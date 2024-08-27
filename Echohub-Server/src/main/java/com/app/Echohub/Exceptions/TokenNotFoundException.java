package com.app.Echohub.Exceptions;


public class TokenNotFoundException extends RuntimeException {

    public TokenNotFoundException() {
        super("invalid token!");
    }

    public TokenNotFoundException(String message) {
        super(message);
    }

}

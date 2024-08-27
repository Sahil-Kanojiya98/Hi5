package com.app.Echohub.Exceptions;

public class EntityNotFoundException extends RuntimeException {

    public EntityNotFoundException() {
        super("User not found!");
    }

    public EntityNotFoundException(String message) {
        super(message);
    }

}
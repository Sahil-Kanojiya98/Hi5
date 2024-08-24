package com.app.VidOrbit.Exceptions;

public class EntityAlreadyExistsException extends RuntimeException {

    public EntityAlreadyExistsException(){
        super("Username already exists!");
    }

    public EntityAlreadyExistsException(String message) {
        super(message);
    }

}

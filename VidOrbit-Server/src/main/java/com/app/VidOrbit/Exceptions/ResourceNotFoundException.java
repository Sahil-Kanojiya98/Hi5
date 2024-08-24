package com.app.VidOrbit.Exceptions;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException() {
        super("Requested Resource Is Not Found !");
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }

}

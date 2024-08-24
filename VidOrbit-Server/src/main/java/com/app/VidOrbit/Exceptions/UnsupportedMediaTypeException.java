package com.app.VidOrbit.Exceptions;

public class UnsupportedMediaTypeException extends RuntimeException {

    public UnsupportedMediaTypeException() {
        super("media not supported");
    }

    public UnsupportedMediaTypeException(String message) {
        super(message);
    }
}

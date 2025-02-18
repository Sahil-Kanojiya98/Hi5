package com.app.Hi5.exceptions;

public class UnauthorizedAccessException extends RuntimeException {
    public UnauthorizedAccessException() {
        super("User might not valid authorities for this operation");
    }

    public UnauthorizedAccessException(String message) {
        super(message);
    }
}

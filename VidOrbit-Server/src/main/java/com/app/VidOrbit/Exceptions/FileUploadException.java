package com.app.VidOrbit.Exceptions;

public class FileUploadException extends RuntimeException {

    public FileUploadException() {
        super("error occured while uploading the file!");
    }

    public FileUploadException(String message) {
        super(message);
    }

}
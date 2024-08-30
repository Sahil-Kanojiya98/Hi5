package com.app.Echohub.Utility.enums;

public enum FileType {
    USER("user"),
    POST("post");

    private final String directory;

    FileType(String directory) {
        this.directory = directory;
    }

    public String getDirectory() {
        return directory;
    }
}
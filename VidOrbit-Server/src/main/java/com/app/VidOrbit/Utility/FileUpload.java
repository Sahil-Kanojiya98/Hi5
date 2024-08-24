package com.app.VidOrbit.Utility;

import com.app.VidOrbit.Exceptions.UnsupportedMediaTypeException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import ws.schild.jave.Encoder;
import ws.schild.jave.EncoderException;
import ws.schild.jave.MultimediaObject;
import ws.schild.jave.info.MultimediaInfo;
import ws.schild.jave.process.ProcessLocator;
import ws.schild.jave.process.ffmpeg.DefaultFFMPEGLocator;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class FileUpload {

    private static final Set<String> IMAGE_EXTENSIONS = new HashSet<String>() {{
        add("jpg");
        add("jpeg");
        add("png");
        add("gif");
        add("bmp");
        add("tiff");
    }};


    public static String saveFile(MultipartFile file, FileType fileType) throws IOException {
        String extension = getFileExtension(file.getOriginalFilename());
        if (
            fileType.equals(FileType.CHANNEL_PROFILE_IMAGE) ||
            fileType.equals(FileType.CHANNEL_COVER_IMAGE) ||
            fileType.equals(FileType.USER_PROFILE_IMAGE) ||
            fileType.equals(FileType.CHANNEL_VIDEO_THUMBNAIL)
        )
        {
            if (!isValidImageExtension(extension)){
                throw new UnsupportedMediaTypeException("unsupported media type: ["+extension+"]");
            }
        }
        String filename = UUID.randomUUID().toString() + "." + extension;
        System.out.println(filename);
        Resource resource = new ClassPathResource(getDirectoryPath(fileType));
        File directory = resource.getFile();
        Path filePath = Paths.get(directory.getAbsolutePath(), filename);
        System.out.println(filePath.toAbsolutePath());
        file.transferTo(filePath.toFile());
        return filename;
    }

    private static String getDirectoryPath(FileType fileType) {
        switch (fileType) {
            case USER_PROFILE_IMAGE:
                return "static" + File.separator + "images" + File.separator + "userProfile";
            case CHANNEL_PROFILE_IMAGE:
                return "static" + File.separator + "images" + File.separator + "channel" + File.separator + "profilePicture";
            case CHANNEL_COVER_IMAGE:
                return "static" + File.separator + "images" + File.separator + "channel" + File.separator + "coverImage";
            case CHANNEL_VIDEO_THUMBNAIL:
                return "static" + File.separator + "images" + File.separator + "thumbnail";
            case CHANNEL_VIDEO:
                return "videos";
            default:
                throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    public static String getStaticCDNpath(FileType fileType) {
        switch (fileType) {
            case USER_PROFILE_IMAGE:
                return "images" + File.separator + "userProfile" + File.separator;
            case CHANNEL_PROFILE_IMAGE:
                return  "images" + File.separator + "channel" + File.separator + "profilePicture" + File.separator;
            case CHANNEL_COVER_IMAGE:
                return  "images" + File.separator + "channel" + File.separator + "coverImage" + File.separator;
            case CHANNEL_VIDEO_THUMBNAIL:
                return  "images" + File.separator + "thumbnail" + File.separator;
            default:
                throw new IllegalArgumentException("Unsupported file type: " + fileType);
        }
    }

    private static String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex == -1) ? "" : filename.substring(dotIndex + 1).trim();
    }

    private static boolean isValidImageExtension(String extension) {
        return IMAGE_EXTENSIONS.contains(extension);
    }

    public static boolean isFileExists(String filename,FileType fileType) {
        Resource resource = new ClassPathResource(getDirectoryPath(fileType) + File.separator + filename);
        return resource.exists();
    }

    public static void deleteFile(String filename,FileType fileType) throws IOException {
        Resource resource = new ClassPathResource(getDirectoryPath(fileType) + File.separator + filename);
        File file = resource.getFile();
        if (file.exists()) {
            System.out.println("file exsists");
            if (!Files.deleteIfExists(file.toPath())){
                throw new IOException("file not deleted");
            }
        } else {
            throw new IOException("File not found: " + filename);
        }
    }


    public static int getDuration(String videoName, FileType fileType) throws EncoderException, IOException {
        System.out.println("static" + File.separator + "videos" + File.separator + videoName);
        Resource resource = new ClassPathResource("videos" + File.separator + videoName);
        System.out.println(resource.getURI());
        MultimediaObject multimediaObject = new MultimediaObject(resource.getFile());
        MultimediaInfo info = multimediaObject.getInfo();
        System.out.println("info = " + info);
        return (int) Math.ceil(info.getDuration() / 1000);
    }

}

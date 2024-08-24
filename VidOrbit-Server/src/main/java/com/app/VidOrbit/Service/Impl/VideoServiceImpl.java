package com.app.VidOrbit.Service.Impl;

import com.app.VidOrbit.DTO.Response.MessageResponse;
import com.app.VidOrbit.Exceptions.FileUploadException;
import com.app.VidOrbit.Model.Category;
import com.app.VidOrbit.Model.User;
import com.app.VidOrbit.Model.Video;
import com.app.VidOrbit.Repository.ChannelRepository;
import com.app.VidOrbit.Repository.VideoRepository;
import com.app.VidOrbit.Service.VideoService;
import com.app.VidOrbit.Utility.FileType;
import com.app.VidOrbit.Utility.FileUpload;
import com.app.VidOrbit.Utility.VideoProcessing;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ws.schild.jave.EncoderException;
import java.io.IOException;


@Service
public class VideoServiceImpl implements VideoService {

    @Autowired
    private VideoRepository videoRepository;
    @Autowired
    private ChannelRepository channelRepository;

    @Override
    public MessageResponse uploadVideo(
            String title,
            String description,
            MultipartFile videoFile,
            MultipartFile thumbnailFile,
            String category,
            String status,
            User user
    )
    {
        if (videoFile == null || videoFile.isEmpty()) {
            throw new FileUploadException("Video file is required");
        }
        if (thumbnailFile == null || thumbnailFile.isEmpty()) {
            throw new FileUploadException("Thumbnail file is required");
        }
        try {
            String thumbnailName = FileUpload.saveFile(thumbnailFile, FileType.CHANNEL_VIDEO_THUMBNAIL);
            String thumbnailURL= FileUpload.getStaticCDNpath(FileType.CHANNEL_VIDEO_THUMBNAIL) + thumbnailName;
            String videoName = FileUpload.saveFile(videoFile, FileType.CHANNEL_VIDEO);
            int duration=FileUpload.getDuration(videoName,FileType.CHANNEL_VIDEO);
            System.out.println("duration = " + duration);
            Video video = Video.builder()
                    .title(title)
                    .description(description)
                    .thumbnailUrl(thumbnailURL)
                    .duration(duration)
                    .category(Category.valueOf(category))
                    .status(status)
                    .build();
            user.getChannel().getVideos().add(video);
            videoRepository.save(video);
            channelRepository.save(user.getChannel());
            VideoProcessing.processVideo(videoName);
            return MessageResponse.builder().message("Video uploaded successfully").build();
        } catch (IOException ex) {
            throw new FileUploadException("Failed to save video file: " + ex.getMessage());
        } catch (EncoderException e) {
            throw new RuntimeException(e);
        }
    }

}

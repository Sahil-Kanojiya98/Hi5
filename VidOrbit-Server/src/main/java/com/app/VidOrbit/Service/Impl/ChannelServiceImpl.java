package com.app.VidOrbit.Service.Impl;

import com.app.VidOrbit.DTO.Request.CreateChannelRequest;
import com.app.VidOrbit.DTO.Request.UpdateChannelRequest;
import com.app.VidOrbit.DTO.Response.CreateChannelResponse;
import com.app.VidOrbit.DTO.Response.UpdateChannelResponse;
import com.app.VidOrbit.Exceptions.*;
import com.app.VidOrbit.Model.Category;
import com.app.VidOrbit.Model.Channel;
import com.app.VidOrbit.Model.User;
import com.app.VidOrbit.Repository.ChannelRepository;
import com.app.VidOrbit.Repository.UserRepository;
import com.app.VidOrbit.Service.ChannelService;
import com.app.VidOrbit.Utility.FileType;
import com.app.VidOrbit.Utility.FileUpload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ChannelServiceImpl implements ChannelService {

    private static final Logger log = LoggerFactory.getLogger(ChannelServiceImpl.class);
    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public CreateChannelResponse createChannel(CreateChannelRequest request, User user){
        if (user.getChannel()!=null){
            throw new EntityAlreadyExistsException("user-channel alredy exsists!");
        }
        MultipartFile profilePicture = request.getProfilePicture();
        MultipartFile coverImage = request.getCoverImage();
        Channel channel = Channel.builder()
                .name(request.getName())
                .category(Category.valueOf(request.getCategory()))
                .description(request.getDescription())
                .profilePictureUrl("/images/channel/profilePicture/default/"+ request.getName().charAt(0) +".jpg")
                .coverImageUrl("/images/channel/coverImage/default/default.jpg")
                .subscribersCount(0)
                .user(user)
                .build();
        try {
            if (profilePicture != null && !profilePicture.isEmpty()) {
                String profilePictureUrl = FileUpload.saveFile(profilePicture, FileType.CHANNEL_PROFILE_IMAGE);
                channel.setProfilePictureUrl(profilePictureUrl);
            }
            if (coverImage != null && !coverImage.isEmpty()) {
                String coverImageUrl = FileUpload.saveFile(coverImage, FileType.CHANNEL_COVER_IMAGE);
                channel.setCoverImageUrl(coverImageUrl);
            }
        } catch (IOException | UnsupportedMediaTypeException ex){
            //trying to clean memory if first file is saved and second is not then removing first file
            if (!channel.getProfilePictureUrl().contains("default")){
                try{
                    FileUpload.deleteFile(channel.getProfilePictureUrl(),FileType.CHANNEL_PROFILE_IMAGE);
                }catch (IOException e){
                    log.error("failed to free memory :"+channel.getProfilePictureUrl());
                }
            }
            throw new FileUploadException("file not saved or uploaded");
        }
        user.setChannel(channel);
        channel = channelRepository.save(channel);
        userRepository.save(user);
        return CreateChannelResponse.builder()
                .channelId(channel.getId())
                .message("channel created successfully.")
                .build();
    }

    @Override
    public Channel getChannelById(String id) {
        return channelRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("channel not found"));
    }


    @Override
    public UpdateChannelResponse updateChannel(UpdateChannelRequest updateRequest, User user) {
        if (user.getChannel()==null){
            throw new EntityNotFoundException("channel not found!");
        }
        if (updateRequest.getName()!=null){
            user.getChannel().setName(updateRequest.getName());
        }
        if (updateRequest.getDescription()!=null){
            user.getChannel().setDescription(updateRequest.getDescription());
        }
        String oldProfilePicture=user.getChannel().getProfilePictureUrl();
        String oldCoverImage=user.getChannel().getCoverImageUrl();
        if (updateRequest.getProfilePicture() != null && !updateRequest.getProfilePicture().isEmpty()) {
            try {
                String profilePictureUrl = FileUpload.saveFile(updateRequest.getProfilePicture(), FileType.CHANNEL_PROFILE_IMAGE);
                user.getChannel().setProfilePictureUrl(profilePictureUrl);
            } catch (IOException e) {
                throw new FileUploadException("Failed to save profile picture"+e);
            }
        }
        if (updateRequest.getCoverImage() != null && !updateRequest.getCoverImage().isEmpty()) {
            try {
                String coverImageUrl = FileUpload.saveFile(updateRequest.getCoverImage(), FileType.CHANNEL_COVER_IMAGE);
                user.getChannel().setCoverImageUrl(coverImageUrl);
            } catch (IOException | UnsupportedMediaTypeException e) {
                if (!user.getChannel().getProfilePictureUrl().contains("default")){
                    try{
                        FileUpload.deleteFile(user.getChannel().getProfilePictureUrl(),FileType.CHANNEL_PROFILE_IMAGE);
                    }catch (IOException ex){
                        log.error("failed to free memory :"+user.getChannel().getProfilePictureUrl());
                    }
                }
                throw new FileUploadException("Failed to save cover image"+e);
            }
        }
//        trying to delete the old images  to free memory
        try{
            if (!oldCoverImage.contains("default")){
                FileUpload.deleteFile(oldCoverImage,FileType.CHANNEL_COVER_IMAGE);
            }
            if (!oldProfilePicture.contains("default")){
                FileUpload.deleteFile(oldProfilePicture,FileType.CHANNEL_PROFILE_IMAGE);
            }
        }catch (IOException ex){
            log.error("failed to free memory :"+ex);
        }
        Channel channel=user.getChannel();
        System.out.println("channel "+channel.getId());
        System.out.println("channel.getDescription() = " + channel.getDescription());
        System.out.println("channel.getCoverImageUrl() = " + channel.getCoverImageUrl());
        System.out.println("channel.getProfilePictureUrl() = " + channel.getProfilePictureUrl());
        System.out.println("channel.getCategory() = " + channel.getCategory());
        channelRepository.save(user.getChannel());
        userRepository.save(user);
        return UpdateChannelResponse.builder().message("channel updated successfully").build();
    }

}

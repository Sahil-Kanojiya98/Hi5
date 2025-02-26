package com.app.Hi5.service;

import com.app.Hi5.dto.response.StoryResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.UnauthorizedAccessException;
import com.app.Hi5.model.Story;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.StoryRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.utility.FileStorage;
import com.app.Hi5.utility.enums.FileType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final FileStorage fileStorage;
    private final NotificationService notificationService;

    public String makeStory(User user, MultipartFile imageFile, MultipartFile videoFile) {
        Story story = Story.builder().userId(user.getId().toHexString()).build();
        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = fileStorage.saveFile(imageFile, FileType.STORY_IMAGE);
                story.setImageUrl(imageUrl);
            }
            if (videoFile != null && !videoFile.isEmpty()) {
                String videoUrl = fileStorage.saveFile(videoFile, FileType.STORY_VIDEO);
                story.setVideoUrl(videoUrl);
            }
            storyRepository.save(story);
            notificationService.makeNewStorySharedNotificationAndSend(user);
            return "Story created successfully";
        } catch (IOException e) {
            log.error("Error while saving files for story: {}", e.getMessage(), e);
            return "Failed to create story: " + e.getMessage();
        } catch (Exception ex) {
            log.error("Unexpected error while creating story: {}", ex.getMessage(), ex);
            return "An unexpected error occurred while creating the story.";
        }
    }

    public void deleteStory(User user, String storyId) {
        Story story = storyRepository.findById(new ObjectId(storyId)).orElseThrow(() -> new EntityNotFoundException("Story not found."));
        if (!story.getUserId().equals(user.getId().toHexString())) {
            throw new UnauthorizedAccessException("You are not authorized to delete this post.");
        }
        try {
            if (story.getImageUrl() != null) {
                fileStorage.deleteFile(story.getImageUrl());
            }
            if (story.getVideoUrl() != null) {
                fileStorage.deleteFile(story.getVideoUrl());
            }
        } catch (IOException e) {
            log.error("Error while saving files for post: {}", e.getMessage(), e);
        } catch (Exception ex) {
            log.error("Unexpected error while creating post: {}", ex.getMessage(), ex);
        }
        storyRepository.delete(story);
    }

    public List<StoryResponse> getMyActiveStorys(User user) {
        Date now = new Date();
        Date last24Hours = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        List<Story> storiesFromLast24Hours = storyRepository.findStoriesFromLast24Hours(user.getId().toHexString(), last24Hours, now);
        System.out.println(storiesFromLast24Hours);
        return storiesFromLast24Hours.stream().map(story -> StoryResponse.builder().id(story.getId().toHexString()).imageUrl(story.getImageUrl()).videoUrl(story.getVideoUrl()).createdAt(story.getCreatedAt()).likeCount(story.getLikedUserIds().size()).build()).collect(Collectors.toList());
    }

}
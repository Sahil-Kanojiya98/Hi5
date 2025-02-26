package com.app.Hi5.service;

import com.app.Hi5.dto.enums.LikeStatus;
import com.app.Hi5.dto.enums.ReportStatus;
import com.app.Hi5.dto.enums.SaveStatus;
import com.app.Hi5.dto.response.ReelResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.UnauthorizedAccessException;
import com.app.Hi5.dto.enums.FollowStatus;
import com.app.Hi5.model.Reel;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.ReelRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.utility.FileStorage;
import com.app.Hi5.utility.Validator;
import com.app.Hi5.utility.enums.FileType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReelService {

    private final UserRepository userRepository;
    private final ReelRepository reelRepository;
    private final FileStorage fileStorage;
    private final NotificationService notificationService;

    public String makeReel(User user, String description, MultipartFile thumbnailImageFile, MultipartFile videoFile, Long duration) {
        Reel reel = Reel.builder().description(description).userId(user.getId().toHexString()).build();
        Validator.validateReelMultipartFilesExsists(thumbnailImageFile, videoFile);
        try {
            String imageUrl = fileStorage.saveFile(thumbnailImageFile, FileType.REEL_THUMBNAIL_IMAGE);
            reel.setThumbnailUrl(imageUrl);
            String videoUrl = fileStorage.saveFile(videoFile, FileType.REEL_VIDEO);
            reel.setVideoUrl(videoUrl);
            reel.setDuration(duration);
            Reel savedReel = reelRepository.save(reel);
            user.getUserReelIds().add(savedReel.getUserId());
            userRepository.save(user);
            notificationService.makeNewReelSharedNotificationAndSend(user);
            return "Reel created successfully!";
        } catch (IOException e) {
            log.error("Error while saving files for Reel: {}", e.getMessage(), e);
            return "Failed to create Reel: " + e.getMessage();
        } catch (Exception ex) {
            log.error("Unexpected error while creating Reel: {}", ex.getMessage(), ex);
            return "An unexpected error occurred while creating the reel.";
        }
    }

    public void deleteReel(User user, String postId) {
        Reel reel = reelRepository.findById(new ObjectId(postId)).orElseThrow(() -> new EntityNotFoundException("Reel not found."));
        if (!reel.getUserId().equals(user.getId().toHexString())) {
            throw new UnauthorizedAccessException("You are not authorized to delete this post.");
        }
        try {
            if (reel.getThumbnailUrl() != null) {
                fileStorage.deleteFile(reel.getThumbnailUrl());
            }
            if (reel.getVideoUrl() != null) {
                fileStorage.deleteFile(reel.getVideoUrl());
            }
        } catch (IOException e) {
            log.error("Error while saving files for post: {}", e.getMessage(), e);
        } catch (Exception ex) {
            log.error("Unexpected error while creating post: {}", ex.getMessage(), ex);
        }
        user.getUserReelIds().remove(reel.getId().toHexString());
        userRepository.save(user);
        reelRepository.delete(reel);
    }

    public List<ReelResponse> findRandomReels(User user, int numberOfPosts) {
        List<Reel> randomReels = reelRepository.findRandomReels(numberOfPosts);
        return randomReels.stream().map(reel -> {
            User reelUser = userRepository.findById(new ObjectId(reel.getUserId())).orElse(null);
            if (reelUser == null) {
                return null;
            }
            return ReelResponse.builder().id(reel.getId().toHexString()).description(reel.getDescription()).thumbnailUrl(reel.getThumbnailUrl()).videoUrl(reel.getVideoUrl()).createdAt(reel.getCreatedAt()).likesCount(reel.getLikedUserIds().size()).commentsCount(reel.getCommentIds().size()).likeStatus(reel.getLikedUserIds().contains(user.getId().toHexString()) ? LikeStatus.LIKED : LikeStatus.NOT_LIKED).reportStatus(reel.getReportedUsersIds().contains(user.getId().toHexString()) ? ReportStatus.REPORTED : ReportStatus.NOT_REPORTED).saveStatus(reel.getSavedUserIds().contains(user.getId().toHexString()) ? SaveStatus.SAVED : SaveStatus.NOT_SAVED).userId(reel.getUserId()).username(reelUser.getUsername()).fullname(reelUser.getFullname()).profilePictureUrl(reelUser.getProfileImageUrl()).followStatus(reelUser.getFollowerUserIds().contains(user.getId().toHexString()) ? FollowStatus.FOLLOWED : (reelUser.getFollowRequestUserIds().contains(user.getId().toHexString()) ? FollowStatus.REQUEST_SENT : FollowStatus.NOT_FOLLOWED)).build();
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

}

package com.app.Hi5.service;

import com.app.Hi5.dto.enums.LikeStatus;
import com.app.Hi5.dto.enums.ReportStatus;
import com.app.Hi5.dto.enums.SaveStatus;
import com.app.Hi5.dto.response.PostResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.UnauthorizedAccessException;
import com.app.Hi5.model.Post;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.PostRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.utility.FileStorage;
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
public class PostService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final FileStorage fileStorage;
    private final NotificationService notificationService;

    public String makePost(User user, String content, MultipartFile imageFile, MultipartFile videoFile) {
        Post post = Post.builder().content(content).userId(user.getId().toHexString()).build();
        try {
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = fileStorage.saveFile(imageFile, FileType.POST_IMAGE);
                post.setImageUrl(imageUrl);
            }
            if (videoFile != null && !videoFile.isEmpty()) {
                String videoUrl = fileStorage.saveFile(videoFile, FileType.POST_VIDEO);
                post.setVideoUrl(videoUrl);
            }
            Post savedPost = postRepository.save(post);
            user.getUserPostIds().add(savedPost.getUserId());
            userRepository.save(user);
            notificationService.makeNewPostSharedNotificationAndSend(user);
            return "Post created successfully!";
        } catch (IOException e) {
            log.error("Error while saving files for post: {}", e.getMessage(), e);
            return "Failed to create post: " + e.getMessage();
        } catch (Exception ex) {
            log.error("Unexpected error while creating post: {}", ex.getMessage(), ex);
            return "An unexpected error occurred while creating the post.";
        }
    }

    public void deletePost(User user, String postId) {
        Post post = postRepository.findById(new ObjectId(postId)).orElseThrow(() -> new EntityNotFoundException("Post not found."));
        if (!post.getUserId().equals(user.getId().toHexString())) {
            throw new UnauthorizedAccessException("You are not authorized to delete this post.");
        }
        try {
            if (post.getImageUrl() != null) {
                fileStorage.deleteFile(post.getImageUrl());
            }
            if (post.getVideoUrl() != null) {
                fileStorage.deleteFile(post.getVideoUrl());
            }
        } catch (IOException e) {
            log.error("Error while saving files for post: {}", e.getMessage(), e);
        } catch (Exception ex) {
            log.error("Unexpected error while creating post: {}", ex.getMessage(), ex);
        }
        user.getUserPostIds().remove(post.getId().toHexString());
        userRepository.save(user);
        postRepository.delete(post);
    }

    public List<PostResponse> findRandomPosts(User user, int numberOfPosts) {
        List<Post> randomPosts = postRepository.findRandomPosts(numberOfPosts);
        return randomPosts.stream().map(post -> {
            User postUser = userRepository.findById(new ObjectId(post.getUserId())).orElse(null);
            if (postUser == null) {
                return null;
            }
            return PostResponse.builder().id(post.getId().toHexString()).userId(post.getUserId()).content(post.getContent()).imageUrl(post.getImageUrl()).videoUrl(post.getVideoUrl()).createdAt(post.getCreatedAt()).likesCount(post.getLikedUserIds().size()).commentsCount(post.getCommentIds().size()).likeStatus(post.getLikedUserIds().contains(user.getId().toHexString()) ? LikeStatus.LIKED : LikeStatus.NOT_LIKED).reportStatus(post.getReportedUsersIds().contains(user.getId().toHexString()) ? ReportStatus.REPORTED : ReportStatus.NOT_REPORTED).saveStatus(post.getSavedUserIds().contains(user.getId().toHexString()) ? SaveStatus.SAVED : SaveStatus.NOT_SAVED).username(postUser.getUsername()).fullname(postUser.getFullname()).profilePictureUrl(postUser.getProfileImageUrl()).build();
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

//    public void likePost(User user, String postId) {
//        Post post = postRepository.findById(new ObjectId(postId)).orElseThrow(() -> new EntityNotFoundException("Post not found."));
//        post.getLikedUserIds().add(user.getId().toHexString());
//        postRepository.save(post);
////        send notification to user.getId(); only once notification can be created for a post
//    }
//
//    public void unlikePost(User user, String postId) {
//        Post post = postRepository.findById(new ObjectId(postId)).orElseThrow(() -> new EntityNotFoundException("Post not found."));
//        post.getLikedUserIds().remove(user.getId().toHexString());
//        postRepository.save(post);
//    }

//    public void addSavedPost(User user, String postId) {
//        Post post = postRepository.findById(new ObjectId(postId)).orElseThrow(() -> new EntityNotFoundException("Post not found."));
//        Save savedContent= Save.builder().saveType()
//        user.getSavedPostIds().add(postId);
//        post.getSavedUserIds().add(user.getId().toHexString());
//        postRepository.save(post);
//        userRepository.save(user);
//    }
//
//    public void removeSavedPost(User user, String postId) {
//        Post post = postRepository.findById(new ObjectId(postId)).orElseThrow(() -> new EntityNotFoundException("Post not found."));
//        user.getSavedPostIds().remove(postId);
//        post.getSavedUserIds().remove(user.getId().toHexString());
//        postRepository.save(post);
//        userRepository.save(user);
//    }

//    public SharedPostResponse findPost(String postId) {
//        return postRepository.findById(new ObjectId(postId)).map(post -> {
//            User postUser = userRepository.findById(new ObjectId(post.getUserId())).orElseThrow(() -> new EntityNotFoundException("user not found!"));
//            return SharedPostResponse.builder().id(post.getId().toHexString()).userId(post.getUserId()).content(post.getContent()).imageUrl(post.getImageUrl()).videoUrl(post.getVideoUrl()).createdAt(post.getCreatedAt()).likesCount(post.getLikedUserIds().size()).commentsCount(post.getCommentIds().size()).username(postUser.getUsername()).fullname(postUser.getFullname()).profilePictureUrl(postUser.getProfileImageUrl()).build();
//        }).orElseThrow(() -> new EntityNotFoundException("Post not found!"));
//    }

//    public List<PostResponse> findSavedPosts(User user, int pageNo, int pageSize) {
//        List<ObjectId> savedPostsList = user.getSavedPostIds().stream().map(ObjectId::new).toList();
//        Page<Post> savedPosts = postRepository.findAllByIdIn(savedPostsList, PageRequest.of(pageNo, pageSize));
//        return savedPosts.map(post -> {
//            User postUser = userRepository.findById(new ObjectId(post.getUserId())).orElse(null);
//            if (postUser == null) {
//                return null;
//            }
//            return PostResponse
//                    .builder()
//                    .id(post.getId().toHexString())
//                    .userId(post.getUserId())
//                    .content(post.getContent())
//                    .imageUrl(post.getImageUrl())
//                    .videoUrl(post.getVideoUrl())
//                    .createdAt(post.getCreatedAt())
//                    .likesCount(post.getLikedUserIds().size())
//                    .commentsCount(post.getCommentIds().size())
//                    .isLiked(post.getLikedUserIds().contains(user.getId().toHexString()))
//                    .isReported(post.getReportedUsersIds().contains(user.getId().toHexString()))
//                    .isSaved(post.getSavedUserIds().contains(user.getId().toHexString()))
//                    .username(postUser.getUsername())
//                    .fullname(postUser.getFullname())
//                    .profilePictureUrl(postUser.getProfileImageUrl())
//                    .build();
//        }).filter(Objects::nonNull).stream().toList();
//    }

}
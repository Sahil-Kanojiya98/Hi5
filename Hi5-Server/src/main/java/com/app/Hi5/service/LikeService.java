package com.app.Hi5.service;

import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.ValidationException;
import com.app.Hi5.model.*;
import com.app.Hi5.model.Enum.LikeType;
import com.app.Hi5.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final CommentRepository commentRepository;

    private final NotificationService notificationService;

    public void like(User user, String relevantId, LikeType type) {
        switch (type) {
            case POST ->
                    postRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("post not found."));
            case REEL ->
                    reelRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("reel not found."));
            case COMMENT ->
                    commentRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("comment not found."));
            case STORY -> {
                // storyRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("story not found."));
            }
            default -> throw new ValidationException("Invalid Type");
        }

        Like like = likeRepository.findByUserIdAndRelevantIdAndLikeType(user.getId().toHexString(), relevantId, type)
                .orElse(Like.builder()
                        .likeType(type)
                        .userId(user.getId().toHexString())
                        .relevantId(relevantId)
                        .build());
        like.setIsLiked(true);
        likeRepository.save(like);

        switch (type) {
            case POST -> {
                Post post = postRepository.findById(new ObjectId(relevantId)).get();
                post.getLikedUserIds().add(user.getId().toHexString());
                postRepository.save(post);
            }
            case REEL -> {
                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
                reel.getLikedUserIds().add(user.getId().toHexString());
                reelRepository.save(reel);
            }
            case COMMENT -> {
                Comment comment = commentRepository.findById(new ObjectId(relevantId)).get();
                comment.getLikedUserIds().add(user.getId().toHexString());
                commentRepository.save(comment);
            }
            case STORY -> {
                // Story story = storyRepository.findById(new ObjectId(relevantId)).get();
                // story.getLikedUserIds().add(user.getId().toHexString());
                // storyRepository.save(story);
            }
        }

        notificationService.makeLikeNotificationAndSend(user, relevantId, type);
    }

    public void unlike(User user, String relevantId, LikeType type) {
        switch (type) {
            case POST ->
                    postRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("post not found."));
            case REEL ->
                    reelRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("reel not found."));
            case COMMENT ->
                    commentRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("comment not found."));
            case STORY -> {
                // storyRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("story not found."));
            }
            default -> throw new ValidationException("Invalid Type");
        }

        Like like = likeRepository.findByUserIdAndRelevantIdAndLikeType(user.getId().toHexString(), relevantId, type)
                .orElse(Like.builder()
                        .likeType(type)
                        .userId(user.getId().toHexString())
                        .relevantId(relevantId)
                        .build());
        like.setIsLiked(false);
        likeRepository.save(like);

        switch (type) {
            case POST -> {
                Post post = postRepository.findById(new ObjectId(relevantId)).get();
                post.getSavedUserIds().remove(user.getId().toHexString());
                postRepository.save(post);
            }
            case REEL -> {
                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
                reel.getSavedUserIds().remove(user.getId().toHexString());
                reelRepository.save(reel);
            }
            case COMMENT -> {
                Comment comment = commentRepository.findById(new ObjectId(relevantId)).get();
                comment.getLikedUserIds().remove(user.getId().toHexString());
                commentRepository.save(comment);
            }
            case STORY -> {
                // Story story = storyRepository.findById(new ObjectId(relevantId)).get();
                // story.getLikedUserIds().remove(user.getId().toHexString());
                // storyRepository.save(story);
            }
        }
    }

}

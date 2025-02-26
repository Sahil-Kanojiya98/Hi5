package com.app.Hi5.service;

import com.app.Hi5.model.*;
import com.app.Hi5.model.Enum.CommentType;
import com.app.Hi5.model.Enum.LikeType;
import com.app.Hi5.model.Enum.NotificationType;
import com.app.Hi5.repository.CommentRepository;
//import com.app.Hi5.repository.NotificationRepository;
import com.app.Hi5.repository.PostRepository;
import com.app.Hi5.repository.ReelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final CommentRepository commentRepository;
//    private final NotificationRepository notificationRepository;

//    public void makeCommentNotificationAndSend(User user, String relevantId, CommentType type) {
//        Notification notification = new Notification();
//        switch (type) {
//            case POST -> {
//                Post post = postRepository.findById(new ObjectId(relevantId)).get();
//                notification.setNotificationUserId(post.getUserId());
//                notification.setType(NotificationType.COMMENT_POST);
//                notification.setRelevantId(post.getId().toHexString());
//            }
//            case REEL -> {
//                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
//                notification.setNotificationUserId(reel.getUserId());
//                notification.setType(NotificationType.COMMENT_REEL);
//                notification.setRelevantId(reel.getId().toHexString());
//            }
//        }
//        notification.setUserProfileImageUrl(user.getProfileImageUrl());
//        notification.setUserUsername(user.getUsername());
//        notification.setUserFullname(user.getFullname());
//        notification.setUserId(user.getId().toHexString());
//        Notification savedNotification = notificationRepository.save(notification);
//
//        sendNotification(notification.getNotificationUserId(), savedNotification);
//    }
//
//    public void makeLikeNotificationAndSend(User user, String relevantId, LikeType type) {
//        Notification notification = new Notification();
//        switch (type) {
//            case POST -> {
//                Post post = postRepository.findById(new ObjectId(relevantId)).get();
//                notification.setNotificationUserId(post.getUserId());
//                notification.setType(NotificationType.COMMENT_POST);
//                notification.setRelevantId(post.getId().toHexString());
//            }
//            case REEL -> {
//                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
//                notification.setNotificationUserId(reel.getUserId());
//                notification.setType(NotificationType.COMMENT_REEL);
//                notification.setRelevantId(reel.getId().toHexString());
//            }
//        }
//        notification.setUserProfileImageUrl(user.getProfileImageUrl());
//        notification.setUserUsername(user.getUsername());
//        notification.setUserFullname(user.getFullname());
//        notification.setUserId(user.getId().toHexString());
//        Notification savedNotification = notificationRepository.save(notification);
//
//        sendNotification(notification.getNotificationUserId(), savedNotification);
//    }
//
//    public void makeFollowNotificationAndSend(User user, User userToFollow) {
//        Notification notification = new Notification();
//        notification.setNotificationUserId(userToFollow.getId().toHexString());
//        notification.setType(NotificationType.FOLLOW_REQUEST);
//        notification.setRelevantId(user.getId().toHexString());
//        notification.setUserProfileImageUrl(user.getProfileImageUrl());
//        notification.setUserUsername(user.getUsername());
//        notification.setUserFullname(user.getFullname());
//        notification.setUserId(user.getId().toHexString());
//        Notification savedNotification = notificationRepository.save(notification);
//        sendNotification(notification.getNotificationUserId(), savedNotification);
//    }
//
//    void sendNotification(String userId, Notification notification) {
//        messagingTemplate.convertAndSend("/notification/" + userId, notification);
//    }

    public void makeNewPostSharedNotificationAndSend(User user) {
        log.info("notifiy network about new post");
    }

    public void makeNewReelSharedNotificationAndSend(User user) {
        log.info("notifiy network about new reel");
    }

    public void makeNewStorySharedNotificationAndSend(User user) {
        log.info("notifiy network about new story");
    }

    public void makeCommentNotificationAndSend(User user, String relevantId, CommentType type) {
        Notification notification = new Notification();
        switch (type) {
            case POST -> {
                Post post = postRepository.findById(new ObjectId(relevantId)).get();
                notification.setNotificationUserId(post.getUserId());
                notification.setType(NotificationType.COMMENT_POST);
                notification.setRelevantId(post.getId().toHexString());
            }
            case REEL -> {
                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
                notification.setNotificationUserId(reel.getUserId());
                notification.setType(NotificationType.COMMENT_REEL);
                notification.setRelevantId(reel.getId().toHexString());
            }
        }
        notification.setUserId(user.getId().toHexString());
        sendNotification(notification.getNotificationUserId(), notification);
    }

    public void makeLikeNotificationAndSend(User user, String relevantId, LikeType type) {
        Notification notification = new Notification();
        switch (type) {
            case POST -> {
                Post post = postRepository.findById(new ObjectId(relevantId)).get();
                notification.setNotificationUserId(post.getUserId());
                notification.setType(NotificationType.COMMENT_POST);
                notification.setRelevantId(post.getId().toHexString());
            }
            case REEL -> {
                Reel reel = reelRepository.findById(new ObjectId(relevantId)).get();
                notification.setNotificationUserId(reel.getUserId());
                notification.setType(NotificationType.COMMENT_REEL);
                notification.setRelevantId(reel.getId().toHexString());
            }
        }
        notification.setUserId(user.getId().toHexString());
        sendNotification(notification.getNotificationUserId(), notification);
    }

    public void makeFollowNotificationAndSend(User user, User userToFollow) {
        Notification notification = new Notification();
        notification.setNotificationUserId(userToFollow.getId().toHexString());
        notification.setType(NotificationType.FOLLOW_REQUEST);
        notification.setRelevantId(user.getId().toHexString());
        notification.setUserId(user.getId().toHexString());
        sendNotification(notification.getNotificationUserId(), notification);
    }

    @Async
    void sendNotification(String userId, Notification notification) {
        log.info("Sending notification to userId: {}, message: {}", userId, notification);
        messagingTemplate.convertAndSend("/notification/" + userId, notification);
    }

}

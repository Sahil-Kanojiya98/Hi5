package com.app.Hi5.service;

import com.app.Hi5.model.Enum.ActivityStatus;
import com.app.Hi5.model.UserActivity;
import com.app.Hi5.repository.UserActivityRepository;
import com.app.Hi5.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserActivityService {

    private final UserActivityRepository userActivityRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void updateUserActivity(String userId, ActivityStatus status) {
        Optional<UserActivity> userActivityOpt = userActivityRepository.findByUserId(userId);
        UserActivity userActivity = userActivityOpt.orElse(UserActivity.builder().userId(userId).activityStatus(status).lastActiveTime(new Date()).build());
        userActivity.setActivityStatus(status);
        userActivity.setLastActiveTime(new Date());
        userActivityRepository.save(userActivity);
        log.info("User activity updated: {}", userActivity);
//        messagingTemplate
//        from chats find users chats   and     send to those users only
    }

}

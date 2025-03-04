package com.app.Hi5.repository;

import com.app.Hi5.model.Notification;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, ObjectId> {

    Page<Notification> findByNotificationUserIdOrderByCreatedAtDesc(String notificationUserId, Pageable pageable);

    Boolean existsByNotificationUserIdAndUserIdAndRelevantId(String notificationUserId, String userId, String relevantId);

    void deleteByNotificationUserId(String notificationUserId);

}
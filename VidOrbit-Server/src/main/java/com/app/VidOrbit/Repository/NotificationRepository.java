package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepository extends MongoRepository<Notification, String> {
}

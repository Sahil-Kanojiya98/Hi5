package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
}

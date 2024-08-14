package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.VideoAnalytics;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VideoAnalyticsRepository extends MongoRepository<VideoAnalytics, String> {
}

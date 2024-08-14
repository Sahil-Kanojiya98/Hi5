package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Video;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VideoRepository extends MongoRepository<Video, String> {
}

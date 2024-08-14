package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Reaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LikeRepository extends MongoRepository<Reaction, String> {
}

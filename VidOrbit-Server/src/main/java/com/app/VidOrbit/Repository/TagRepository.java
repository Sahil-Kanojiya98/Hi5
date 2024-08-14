package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Tag;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TagRepository extends MongoRepository<Tag, String> {
}

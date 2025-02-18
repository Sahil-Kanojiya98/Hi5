package com.app.Hi5.repository;

import com.app.Hi5.model.Post;
import com.app.Hi5.model.Reel;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReelRepository extends MongoRepository<Reel, ObjectId> {

    @Aggregation(pipeline = {
            "{ $sample: { size: ?0 } }"
    })
    List<Reel> findRandomReels(int numberOfReels);

}

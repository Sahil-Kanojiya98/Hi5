package com.app.Hi5.repository;

import com.app.Hi5.model.Enum.LikeType;
import com.app.Hi5.model.Like;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, ObjectId> {

    Optional<Like> findByUserIdAndRelevantIdAndLikeType(String userId, String relevantId, LikeType liketype);

    Page<Like> findByRelevantIdAndLikeTypeAndIsLikedTrueOrderByCreatedAtDesc(String relevantId, LikeType likeType, Pageable pageable);

}

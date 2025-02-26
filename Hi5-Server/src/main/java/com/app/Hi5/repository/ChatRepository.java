package com.app.Hi5.repository;

import com.app.Hi5.model.Chat;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ChatRepository extends MongoRepository<Chat, ObjectId> {

    List<Chat> findByChatUserIdsContaining(String userId);

    @Query("{ 'chat_users': { $all : [ ?0, ?1 ] } }")
    Optional<Chat> findByChatUserIdsContaining(String userId1, String userId2);

}
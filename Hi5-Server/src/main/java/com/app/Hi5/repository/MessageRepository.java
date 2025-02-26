package com.app.Hi5.repository;

import com.app.Hi5.model.Message;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, ObjectId> {

    List<Message> findByChatIdOrderByCreatedAtAsc(String chatId);

}
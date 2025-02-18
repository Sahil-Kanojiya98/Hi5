package com.app.Hi5.repository;

import com.app.Hi5.model.Enum.SaveType;
import com.app.Hi5.model.Save;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.BitSet;
import java.util.Optional;

@Repository
public interface SaveRepository extends MongoRepository<Save,ObjectId> {

    Optional<Save> findByUserIdAndRelevantIdAndSaveType(String userId, String relevantId, SaveType saveType);

}

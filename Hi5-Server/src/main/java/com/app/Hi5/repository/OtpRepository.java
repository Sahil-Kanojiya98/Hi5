package com.app.Hi5.repository;

import com.app.Hi5.model.Otp;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends MongoRepository<Otp, ObjectId> {

    Optional<Otp> findByOtpAndEmail(String otp, String email);

    Optional<Otp> findByEmail(String email);

}

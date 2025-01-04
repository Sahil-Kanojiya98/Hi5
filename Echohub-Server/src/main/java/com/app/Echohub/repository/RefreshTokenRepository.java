//package com.app.Echohub.repository;
//
//import com.app.Echohub.model.RefreshToken;
//import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {
//    Optional<List<RefreshToken>> findByUsername(String username);
//    Optional<RefreshToken> findByToken(String token);
//    void deleteByToken(String token);
//}
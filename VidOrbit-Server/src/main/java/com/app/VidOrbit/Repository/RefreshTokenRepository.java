package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.RefreshToken;
import com.app.VidOrbit.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends MongoRepository<RefreshToken, String> {
    Optional<List<RefreshToken>> findByUsername(String username);
    Optional<RefreshToken> findByToken(String token);
    void deleteByToken(String token);

}
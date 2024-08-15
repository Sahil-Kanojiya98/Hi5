package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {


    Optional<User> findByEmail(String username);

}

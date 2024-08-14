package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String username);

}

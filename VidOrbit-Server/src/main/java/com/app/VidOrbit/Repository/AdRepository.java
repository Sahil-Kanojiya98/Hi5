package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Ad;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdRepository extends MongoRepository<Ad, String> {
}

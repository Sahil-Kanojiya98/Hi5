package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Advertiser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdvertiserRepository extends MongoRepository<Advertiser, String> {
}

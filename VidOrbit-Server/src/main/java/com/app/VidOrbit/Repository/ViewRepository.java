package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.View;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ViewRepository extends MongoRepository<View, String> {
}

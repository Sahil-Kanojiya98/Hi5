package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Channel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChannelRepository extends MongoRepository<Channel, String> {
}

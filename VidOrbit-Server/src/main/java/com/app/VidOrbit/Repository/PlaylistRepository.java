package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Playlist;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlaylistRepository extends MongoRepository<Playlist, String> {
}

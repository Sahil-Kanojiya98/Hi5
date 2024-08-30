package com.app.Echohub.Repository;

import com.app.Echohub.Model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepository  extends MongoRepository<Post, String> {

}

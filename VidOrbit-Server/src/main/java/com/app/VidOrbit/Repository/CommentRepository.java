package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepository extends MongoRepository<Comment, String> {
}

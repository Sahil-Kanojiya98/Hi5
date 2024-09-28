package com.app.Echohub.Repository;

import com.app.Echohub.DTO.CommentResponseDTO;
import com.app.Echohub.Model.Comment;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface CommentRepository extends MongoRepository<Comment, String> {

    @Aggregation(pipeline = {
            "{ '$match': { '_id': { '$in': ?0 } } }",
            "{ $lookup: { from: 'users', localField: 'user.$id', foreignField: '_id', as: 'user_details' } }",
            "{ $unwind: '$user_details' }",
            "{ '$project': { " +
                    "    'commentId': '$_id', " +
                    "    'content': 1, " +
                    "    'created_at': 1 , " +
                    "    'likeCount': { '$size': '$likes' }," +
                    "    'likedFlag': { $cond: { if: { $in: [?3 , '$likes'] }, then: true, else: false } }, " +
                    "    'userID': '$user_details._id', " +
                    "    'userName': '$user_details.username', " +
                    "    'userFullName': '$user_details.fullname', " +
                    "    'userProfilePicture': '$user_details.profile_picture_url' " +
                    "} }",
            "{ '$skip': ?1 }",
            "{ '$limit': ?2 }"
    })
    List<CommentResponseDTO> findCommentsByIds(Set<String> commentIds, int skip, int limit,String userId);


}


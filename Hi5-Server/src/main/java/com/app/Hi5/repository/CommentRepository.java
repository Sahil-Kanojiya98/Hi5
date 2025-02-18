package com.app.Hi5.repository;

import com.app.Hi5.model.Comment;
import com.app.Hi5.model.Enum.CommentType;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<Comment, ObjectId> {

    Page<Comment> findByTypeAndRelevantId(CommentType commentType, String relevantId, PageRequest pageRequest);

//    @Aggregation(pipeline = {
//            "{ '$match': { '_id': { '$in': ?0 } } }",
//            "{ $lookup: { from: 'users', localField: 'user.$id', foreignField: '_id', as: 'user_details' } }",
//            "{ $unwind: '$user_details' }",
//            "{ '$project': { " +
//                    "    'commentId': '$_id', " +
//                    "    'content': 1, " +
//                    "    'created_at': 1 , " +
//                    "    'likeCount': { '$size': '$likes' }," +
//                    "    'likedFlag': { $cond: { if: { $in: [?3 , '$likes'] }, then: true, else: false } }, " +
//                    "    'userID': '$user_details._id', " +
//                    "    'userName': '$user_details.username', " +
//                    "    'userFullName': '$user_details.fullname', " +
//                    "    'userProfilePicture': '$user_details.profile_picture_url' " +
//                    "} }",
//            "{ '$skip': ?1 }",
//            "{ '$limit': ?2 }"
//    })
//    List<CommentResponseDTO> findCommentsByIds(Set<String> commentIds, int skip, int limit,String userId);
//    @Aggregation(pipeline = {
//            "{ '$match': { '_id': { '$in': ?0 } } }",
//            "{ $lookup: { from: 'users', localField: 'user.$id', foreignField: '_id', as: 'user_details' } }",
//            "{ $unwind: '$user_details' }",
//            "{ '$project': { " +
//                    "    'commentId': '$_id', " +
//                    "    'content': 1, " +
//                    "    'created_at': 1 , " +
//                    "    'likeCount': { '$size': '$likes' }," +
//                    "    'likedFlag': { $cond: { if: { $in: [?3 , '$likes'] }, then: true, else: false } }, " +
//                    "    'userID': '$user_details._id', " +
//                    "    'userName': '$user_details.username', " +
//                    "    'userFullName': '$user_details.fullname', " +
//                    "    'userProfilePicture': '$user_details.profile_picture_url' " +
//                    "} }",
//            "{ '$sort': { 'created_at': -1 } }",
//            "{ '$skip': ?1 }",
//            "{ '$limit': ?2 }"
//    })
//    List<CommentResponseDTO> findCommentsByIds(Set<String> commentIds, int skip, int limit, String userId);

}
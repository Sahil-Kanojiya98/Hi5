package com.app.Echohub.Repository;

import com.app.Echohub.DTO.PostResponseDTO;
import com.app.Echohub.Model.Post;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Set;

public interface PostRepository  extends MongoRepository<Post, String> {

    @Aggregation(pipeline = {
            "{ $sample: { size: ?1 } }",
            "{ $lookup: { from: 'users', localField: 'user.$id', foreignField: '_id', as: 'user_details' } }",
            "{ $unwind: '$user_details' }",
            "{ $project: { " +
                    "'id': '$_id', " +
                    "'content': 1, " +
                    "'image_url': 1, " +
                    "'video_url': 1, " +
                    "'created_at': 1, " +
                    "'likesCount': { $size: '$likes' }, " +
                    "'commentsCount': { $size: '$comments' }, " +
                    "'isLiked': { $cond: { if: { $in: [?0, '$likes'] }, then: true, else: false } }, " +
                    "'isSaved': { $cond: { if: { $in: [?0, '$saved_by_users'] }, then: true, else: false } }, " +
                    "'userID': '$user_details._id', " +
                    "'username': '$user_details.username', " +
                    "'fullname': '$user_details.fullname', " +
                    "'profilePictureUrl': '$user_details.profile_picture_url' " +
                    "} }"
    })
    List<PostResponseDTO> findRandomPostsWithUserDetails(String currentUserId,int numberOfPosts);

    @Aggregation(pipeline = {
            "{ $match: { 'user': { $in: ?1 } } }", // Filter posts by users
            "{ $sort: { 'created_at': -1 } }",
            "{ $lookup: { from: 'users', localField: 'user.$id', foreignField: '_id', as: 'user_details' } }", // Join user details
            "{ $unwind: '$user_details' }", // Unwind user details
            "{ $project: { " +
                    "'id': '$_id', " +
                    "'content': 1, " +
                    "'image_url': 1, " +
                    "'video_url': 1, " +
                    "'created_at': 1, " +
                    "'likesCount': { $size: '$likes' }, " +
                    "'commentsCount': { $size: '$comments' }, " +
                    "'isLiked': { $cond: { if: { $in: [?0, '$likes'] }, then: true, else: false } }, " +
                    "'isSaved': { $cond: { if: { $in: [?0, '$saved_by_users'] }, then: true, else: false } }, " +
                    "'userID': '$user_details._id', " +
                    "'username': '$user_details.username', " +
                    "'fullname': '$user_details.fullname', " +
                    "'profilePictureUrl': '$user_details.profile_picture_url' " +
                    "} }",
            "{ $skip: ?2 }", // Skip based on the page (e.g., page * pageSize)
            "{ $limit: ?3 }" // Limit based on the page size
    })
    List<PostResponseDTO> findPostsByUserIdsWithPaginationAndOrder(
            String currentUserId, Set<String> userIds, int skip, int limit);


    @Aggregation(pipeline = {
            "{ $match: { '_id': { $in: ?1 } } }",
            "{ $sort: { 'created_at': -1 } }",
            "{ $lookup: { from: 'users', localField: 'user.$id', foreignField: '_id', as: 'user_details' } }", // Join user details
            "{ $unwind: '$user_details' }",
            "{ $project: { " +
                    "'id': '$_id', " +
                    "'content': 1, " +
                    "'image_url': 1, " +
                    "'video_url': 1, " +
                    "'created_at': 1, " +
                    "'likesCount': { $size: '$likes' }, " +
                    "'commentsCount': { $size: '$comments' }, " +
                    "'isLiked': { $cond: { if: { $in: [?0, '$likes'] }, then: true, else: false } }, " +
                    "'isSaved': { $cond: { if: { $in: [?0, '$saved_by_users'] }, then: true, else: false } }, " +
                    "'userID': '$user_details._id', " +
                    "'username': '$user_details.username', " +
                    "'fullname': '$user_details.fullname', " +
                    "'profilePictureUrl': '$user_details.profile_picture_url' " +
                    "} }",
            "{ $skip: ?2 }",
            "{ $limit: ?3 }"
    })
    List<PostResponseDTO> findSavedPostsWithPagination(
            String currentUserId, Set<String> postIds, int skip, int limit
    );

}
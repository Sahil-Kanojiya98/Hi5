package com.app.Hi5.repository;

import com.app.Hi5.model.Report;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ReportRepository extends MongoRepository<Report, ObjectId> {

//    @Aggregation(pipeline = {
//            "{ $group: { _id: '$post_id', reportCount: { $sum: 1 } } }",
//            "{ $project: { reported_post_id: '$_id', reportCount: 1 } }"
//    })
//    List<PostReportDTO> getPostReportStats();

//    @Aggregation(pipeline = {
//            "{ $group: { _id: '$post_id', reportCount: { $sum: 1 } } }",
//            "{ $project: { reported_post_id: '$_id', reportCount: 1 } }",
//            "{ $sort: { reportCount: -1 } }",  // Sort by reportCount in descending order
//            "{ $skip: ?0 }",  // Skip the number of documents for pagination
//            "{ $limit: ?1 }"  // Limit the number of documents for pagination
//    })
//    List<PostReportDTO> getPostReportStats(int skip, int limit);
//
//    void deleteAllByPostId(String postId);

}

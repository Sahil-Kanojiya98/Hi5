package com.app.Echohub.Repository;

import com.app.Echohub.DTO.PostReportDTO;
import com.app.Echohub.Model.Report;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends MongoRepository<Report, String> {

//    @Aggregation(pipeline = {
//            "{ $group: { _id: '$post_id', reportCount: { $sum: 1 } } }",
//            "{ $project: { reported_post_id: '$_id', reportCount: 1 } }"
//    })
//    List<PostReportDTO> getPostReportStats();

    @Aggregation(pipeline = {
            "{ $group: { _id: '$post_id', reportCount: { $sum: 1 } } }",
            "{ $project: { reported_post_id: '$_id', reportCount: 1 } }",
            "{ $sort: { reportCount: -1 } }",  // Sort by reportCount in descending order
            "{ $skip: ?0 }",  // Skip the number of documents for pagination
            "{ $limit: ?1 }"  // Limit the number of documents for pagination
    })
    List<PostReportDTO> getPostReportStats(int skip, int limit);

    void deleteAllByPostId(String postId);

}

//package com.app.Echohub.service.Impl;
//
//import com.app.Echohub.dto.PostReportDTO;
//import com.app.Echohub.dto.request.ReportRequestDTO;
//import com.app.Echohub.exceptions.EntityNotFoundException;
//import com.app.Echohub.model.Post;
//import com.app.Echohub.model.Report;
//import com.app.Echohub.model.User;
//import com.app.Echohub.repository.PostRepository;
//import com.app.Echohub.repository.ReportRepository;
//import com.app.Echohub.repository.UserRepository;
//import com.app.Echohub.service.ReportService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class ReportServiceImpl implements ReportService {
//
//    @Autowired
//    UserRepository userRepository;
//
//    @Autowired
//    PostRepository postRepository;
//
//    @Autowired
//    ReportRepository reportRepository;
//
//    @Override
//    public Report createReport(ReportRequestDTO reportRequest, User user) {
//        Post post = postRepository.findById(reportRequest.getPostId())
//                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
//        post.getReportedBy().add(user.getId());
//        postRepository.save(post);
//        Report report = Report.builder()
//                .reason(reportRequest.getReason())
//                .postId(post.getId())
//                .reportedBy(user.getId())
//                .build();
//        return reportRepository.save(report);
//    }
//
//    @Override
//    public List<PostReportDTO> getPostReportStats(int skip, int limit) {
//        List<PostReportDTO> postReportStats = reportRepository.getPostReportStats(skip, limit);
//        for (PostReportDTO post:postReportStats){
//            post.setPostResponse(postRepository.findPostByIdWithUserDetails(post.getReported_post_id()));
//        }
//        return postReportStats;
//    }
//
//}

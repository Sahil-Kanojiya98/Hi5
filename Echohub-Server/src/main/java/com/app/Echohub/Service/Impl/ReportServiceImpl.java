package com.app.Echohub.Service.Impl;

import com.app.Echohub.DTO.PostReportDTO;
import com.app.Echohub.DTO.Request.ReportRequestDTO;
import com.app.Echohub.Exceptions.EntityNotFoundException;
import com.app.Echohub.Model.Post;
import com.app.Echohub.Model.Report;
import com.app.Echohub.Model.User;
import com.app.Echohub.Repository.PostRepository;
import com.app.Echohub.Repository.ReportRepository;
import com.app.Echohub.Repository.UserRepository;
import com.app.Echohub.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PostRepository postRepository;

    @Autowired
    ReportRepository reportRepository;

    @Override
    public Report createReport(ReportRequestDTO reportRequest, User user) {
        Post post = postRepository.findById(reportRequest.getPostId())
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        post.getReportedBy().add(user.getId());
        postRepository.save(post);
        Report report = Report.builder()
                .reason(reportRequest.getReason())
                .postId(post.getId())
                .reportedBy(user.getId())
                .build();
        return reportRepository.save(report);
    }

    @Override
    public List<PostReportDTO> getPostReportStats(int skip, int limit) {
        List<PostReportDTO> postReportStats = reportRepository.getPostReportStats(skip, limit);
        for (PostReportDTO post:postReportStats){
            post.setPostResponse(postRepository.findPostByIdWithUserDetails(post.getReported_post_id()));
        }
        return postReportStats;
    }

}

package com.app.Hi5.service;

import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.model.*;
import com.app.Hi5.model.Enum.ReportReason;
import com.app.Hi5.model.Enum.ReportType;
import com.app.Hi5.repository.*;
import com.app.Hi5.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final CommentRepository commentRepository;

    public void reportPost(User user, String relevantId, ReportType type, ReportReason reason) {
        Report report = Report.builder().relevantId(relevantId).type(type).reportedUserId(user.getId().toHexString()).reason(reason).build();
        switch(type) {
            case POST -> {
                Post post = postRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("post not found."));
                post.getReportedUsersIds().add(user.getId().toHexString());
                postRepository.save(post);
            }
            case REEL -> {
                Reel reel = reelRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("reel not found."));
                reel.getReportedUsersIds().add(user.getId().toHexString());
                reelRepository.save(reel);
            }
            case COMMENT -> {
                Comment comment = commentRepository.findById(new ObjectId(relevantId)).orElseThrow(() -> new EntityNotFoundException("comment not found."));
                comment.getReportedUsersIds().add(user.getId().toHexString());
                commentRepository.save(comment);
            }
            default -> throw new EntityNotFoundException("relevantId not found.");
        }
        reportRepository.save(report);
    }

//    List<PostReportDTO> getPostReportStats(int skip, int limit);

}
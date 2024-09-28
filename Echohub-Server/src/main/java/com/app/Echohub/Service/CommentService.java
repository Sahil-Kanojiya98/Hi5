package com.app.Echohub.Service;

import com.app.Echohub.DTO.CommentResponseDTO;
import com.app.Echohub.DTO.Request.CommentRequest;
import com.app.Echohub.Model.Comment;
import com.app.Echohub.Model.User;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Set;

public interface CommentService {

    Comment makePostComments(User user, String postId, CommentRequest commentRequest);

    List<CommentResponseDTO> getComment(String postId, int page, int pageSize, User user);

    void deleteComment(User user, String commentId) throws AccessDeniedException;

    void likeComment(User user, String commentId);

    void unlikeComment(User user, String commentId);

}

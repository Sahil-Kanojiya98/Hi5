package com.app.Echohub.Service;

import com.app.Echohub.DTO.Request.CommentRequest;
import com.app.Echohub.Model.Comment;
import com.app.Echohub.Model.User;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Set;

public interface CommentService {

    Set<Comment> getPostComments(String postId);

    Comment makePostComments(User user, String postId, CommentRequest commentRequest);

//    void deleteComment(User user, String commentId) throws AccessDeniedException;

//    void deleteComment(User user, String commentId);
//
//    void likeComment(User user, String commentId);
//
//    void unlikeComment(User user, String commentId);
}

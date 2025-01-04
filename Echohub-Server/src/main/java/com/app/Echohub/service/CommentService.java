//package com.app.Echohub.service;
//
//import com.app.Echohub.dto.CommentResponseDTO;
//import com.app.Echohub.dto.request.CommentRequest;
//import com.app.Echohub.model.Comment;
//import com.app.Echohub.model.User;
//
//import java.nio.file.AccessDeniedException;
//import java.util.List;
//
//public interface CommentService {
//
//    Comment makePostComments(User user, String postId, CommentRequest commentRequest);
//
//    List<CommentResponseDTO> getComment(String postId, int page, int pageSize, User user);
//
//    void deleteComment(User user, String commentId) throws AccessDeniedException;
//
//    void likeComment(User user, String commentId);
//
//    void unlikeComment(User user, String commentId);
//
//}

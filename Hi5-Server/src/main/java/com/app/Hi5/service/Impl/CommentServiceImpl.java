//package com.app.Echohub.service.Impl;
//
//import com.app.Echohub.dto.CommentResponseDTO;
//import com.app.Echohub.dto.request.CommentRequest;
//import com.app.Echohub.exceptions.EntityNotFoundException;
//import com.app.Echohub.model.Comment;
//import com.app.Echohub.model.Post;
//import com.app.Echohub.model.User;
//import com.app.Echohub.repository.CommentRepository;
//import com.app.Echohub.repository.PostRepository;
//import com.app.Echohub.repository.UserRepository;
//import com.app.Echohub.service.CommentService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.nio.file.AccessDeniedException;
//import java.util.LinkedList;
//import java.util.List;
//import java.util.Set;
//
//@Service
//public class CommentServiceImpl implements CommentService {
//
//    @Autowired
//    private CommentRepository commentRepository;
//
//    @Autowired
//    private PostRepository postRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Override
//    public Comment makePostComments(User user, String postId, CommentRequest commentRequest) {
//        Post post = postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("Post not found!"));
//        Comment comment=Comment
//                .builder()
//                .content(commentRequest.getContent())
//                .user(user)
//                .postId(post.getId())
//                .build();
//        Comment persistedComment = commentRepository.save(comment);
//        post.getComments().add(persistedComment.getId());
//        System.out.println(post+"   "+persistedComment);
//        postRepository.save(post);
//        return persistedComment;
//    }
//
//    @Override
//    public List<CommentResponseDTO> getComment(String postId, int page, int pageSize, User user) {
//        Post post = postRepository.findById(postId)
//                .orElseThrow(() -> new EntityNotFoundException("post not found"));
//        Set<String> commentIds = post.getComments();
//        if (commentIds.isEmpty()) {
//            return new LinkedList<>(); // Return empty if no comments
//        }
//        int skip = page * pageSize;
//        return commentRepository.findCommentsByIds(commentIds, skip, pageSize,user.getId());
//    }
//
//
//    @Override
//    public void deleteComment(User user,String commentId) throws AccessDeniedException {
//        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new EntityNotFoundException("comment not found"));
//        Post post = postRepository.findById(comment.getPostId()).orElseThrow(() -> new EntityNotFoundException("post not found to delete comment"));
//        String commentedUserId = comment.getUser().getId();
//        System.out.println(comment);
//        System.out.println(user);
//        if (commentedUserId.equals(user.getId())){
//            post.getComments().remove(comment.getId());
//            commentRepository.delete(comment);
//            postRepository.save(post);
//        }else{
//            throw new AccessDeniedException("you can not delete this post");
//        }
//    }
//
//    @Override
//    public void likeComment(User user, String commentId) {
//        Comment comment=commentRepository.findById(commentId).orElseThrow(()->new EntityNotFoundException("comment not found"));
//        System.out.println("comment:+===================="+comment);
//        if (!comment.getLikes().contains(user.getId())){
//            comment.getLikes().add(user.getId());
//            System.out.println(comment.getLikes());
//            commentRepository.save(comment);
//        }else{
//            throw new IllegalStateException("already liked");
//        }
//    }
//
//    @Override
//    public void unlikeComment(User user, String commentId) {
//        Comment comment=commentRepository.findById(commentId).orElseThrow(()->new EntityNotFoundException("comment not found"));
//        if (comment.getLikes().contains(user.getId())){
//            comment.getLikes().remove(user.getId());
//            commentRepository.save(comment);
//        }
//        else {
//            throw new IllegalStateException("not previously liked to unlike");
//        }
//    }
//
//}

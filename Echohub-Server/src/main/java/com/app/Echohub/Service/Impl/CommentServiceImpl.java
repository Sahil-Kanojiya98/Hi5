package com.app.Echohub.Service.Impl;

import com.app.Echohub.DTO.Request.CommentRequest;
import com.app.Echohub.Exceptions.EntityNotFoundException;
import com.app.Echohub.Model.Comment;
import com.app.Echohub.Model.Post;
import com.app.Echohub.Model.User;
import com.app.Echohub.Repository.CommentRepository;
import com.app.Echohub.Repository.PostRepository;
import com.app.Echohub.Repository.UserRepository;
import com.app.Echohub.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Override
    public Set<Comment> getPostComments(String postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("Post not found!"));
        return post.getComments();
    }

    @Override
    public Comment makePostComments(User user, String postId, CommentRequest commentRequest) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("Post not found!"));
        Comment comment=Comment
                .builder()
                .content(commentRequest.getContent())
                .user(user)
                .postId(postId)
                .build();
        Comment persistedComment = commentRepository.save(comment);
        post.setCommentsCount(post.getCommentsCount()+1);
        post.getComments().add(comment);
        postRepository.save(post);
        return persistedComment;
    }

    @Override
    public void deleteComment(User user,String commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new EntityNotFoundException("comment not found"));
        Post post = postRepository.findById(comment.getPostId()).orElseThrow(() -> new EntityNotFoundException("post not found to delete comment"));
        User commentedUser = comment.getUser();
        if (commentedUser.getId().equals(user.getId())){
            post.setCommentsCount(post.getCommentsCount()-1);
            post.getComments().remove(comment);
            commentRepository.delete(comment);
            postRepository.save(post);
        }else{
            throw new AccessDeniedException("you can not delete this post");
        }
    }

    @Override
    public void likeComment(User user, String commentId) {
        Comment comment=commentRepository.findById(commentId).orElseThrow(()->new EntityNotFoundException("comment not found"));
        if (!comment.getLikes().contains(user.getId())){
            comment.setLikesCount(comment.getLikesCount()+1);
            comment.getLikes().add(user.getId());
            commentRepository.save(comment);
        }else{
            throw new IllegalStateException("already liked");
        }
    }

    @Override
    public void unlikeComment(User user, String commentId) {
        Comment comment=commentRepository.findById(commentId).orElseThrow(()->new EntityNotFoundException("comment not found"));
        if (comment.getLikes().contains(user.getId())){
            comment.setLikesCount(comment.getLikesCount()-1);
            comment.getLikes().remove(user.getId());
            commentRepository.save(comment);
        }
        else {
            throw new IllegalStateException("not liked to unlike");
        }
    }

}

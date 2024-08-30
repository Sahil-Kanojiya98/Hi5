package com.app.Echohub.Service;

import com.app.Echohub.Model.Post;
import com.app.Echohub.Model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

public interface PostService {

    Post makePost(User user, String content, MultipartFile imageFile, MultipartFile videoFile);

    Post getPost(String id);

    List<Post> getAllPost(String userId);

    void deletePost(User user, String postId);

    void likePost(User user, String postId);

    void unlikePost(User user, String postId);

}

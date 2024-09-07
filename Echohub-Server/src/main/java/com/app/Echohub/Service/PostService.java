package com.app.Echohub.Service;

import com.app.Echohub.DTO.PostResponseDTO;
import com.app.Echohub.Model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostService {

    String makePost(User user, String content, MultipartFile imageFile, MultipartFile videoFile);

    List<PostResponseDTO> findRandomPosts(User user,int number);

//    Post getPost(String id);

//    List<Post> getAllPost(String userId);

    void deletePost(User user, String postId);

    void likePost(User user, String postId);

    void unlikePost(User user, String postId);

}

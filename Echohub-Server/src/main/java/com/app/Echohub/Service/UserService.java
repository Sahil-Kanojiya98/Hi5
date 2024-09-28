package com.app.Echohub.Service;

import com.app.Echohub.DTO.ImageUpdateResponseDTO;
import com.app.Echohub.DTO.PostResponseDTO;
import com.app.Echohub.DTO.Request.UpdateUserRequest;
import com.app.Echohub.DTO.UserDescResponse;
import com.app.Echohub.DTO.UserProfileDTO;
import com.app.Echohub.Model.Post;
import com.app.Echohub.Model.User;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    User getUserByEmail(String email);

    void persist(User user);
    
    User updateUser(User user, UpdateUserRequest updateUserRequest);

    ImageUpdateResponseDTO updateUserImages(User user, MultipartFile profilePicture, MultipartFile coverPicture) throws RuntimeException;

    List<PostResponseDTO> getAllSavedPosts(User user, int page, int pageSize);

    void addSavedPost(User user, String postId);

    void removeSavedPost(User user, String postId);

//    List<User> searchUsers(String pattern);

      List<UserDescResponse> suggest();

    String follow(String userId, User user);

    String unfollow(String userId, User user);

    UserProfileDTO getProfile(String userId, String myid);

    Page<User> searchUsers(String pattern, int page, int size);
}

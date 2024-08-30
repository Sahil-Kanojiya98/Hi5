package com.app.Echohub.Service;

import com.app.Echohub.DTO.Request.UpdateUserRequest;
import com.app.Echohub.Model.Post;
import com.app.Echohub.Model.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

public interface UserService {
    User getUserByEmail(String email);

    void persist(User user);

    User updateUser(User user, UpdateUserRequest updateUserRequest);

    User updateUserImages(User user, MultipartFile profilePicture, MultipartFile coverPicture) throws RuntimeException;

    List<Post> getAllSavedPosts(User user);

    void addSavedPost(User user, String postId);

    void removeSavedPost(User user, String postId);

    List<User> searchUsers(String pattern);
}

//package com.app.Echohub.service;
//
//import com.app.Echohub.dto.ImageUpdateResponseDTO;
//import com.app.Echohub.dto.PostResponseDTO;
//import com.app.Echohub.dto.request.UpdateUserRequest;
//import com.app.Echohub.dto.UserDescResponse;
//import com.app.Echohub.dto.UserProfileDTO;
//import com.app.Echohub.model.User;
//import org.springframework.data.domain.Page;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//
//public interface UserService {
//
//    User getUserByEmail(String email);
//
//    void persist(User user);
//
//    User updateUser(User user, UpdateUserRequest updateUserRequest);
//
//    ImageUpdateResponseDTO updateUserImages(User user, MultipartFile profilePicture, MultipartFile coverPicture) throws RuntimeException;
//
//    List<PostResponseDTO> getAllSavedPosts(User user, int page, int pageSize);
//
//    void addSavedPost(User user, String postId);
//
//    void removeSavedPost(User user, String postId);
//
//    List<UserDescResponse> suggest();
//
//    String follow(String userId, User user);
//
//    String unfollow(String userId, User user);
//
//    UserProfileDTO getProfile(String userId, String myid);
//
//    Page<User> searchUsers(String pattern, int page, int size);
//
//}

package com.app.Echohub.Service.Impl;

import com.app.Echohub.DTO.ImageUpdateResponseDTO;
import com.app.Echohub.DTO.PostResponseDTO;
import com.app.Echohub.DTO.Request.UpdateUserRequest;
import com.app.Echohub.DTO.UserDescResponse;
import com.app.Echohub.DTO.UserProfileDTO;
import com.app.Echohub.Exceptions.EntityAlreadyExistsException;
import com.app.Echohub.Exceptions.EntityNotFoundException;
import com.app.Echohub.Exceptions.InvalidUsernameOrPasswordException;
import com.app.Echohub.Model.Post;
import com.app.Echohub.Model.User;
import com.app.Echohub.Repository.PostRepository;
import com.app.Echohub.Repository.UserRepository;
import com.app.Echohub.Service.UserService;
import com.app.Echohub.Utility.FileStorage;
import com.app.Echohub.Utility.enums.FileType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private PostRepository postRepository;

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidUsernameOrPasswordException("User not found with email: " + email));
    }

    @Override
    public void persist(User user) {
        userRepository.save(user);
    }


    @Override
    public User updateUser(User user, UpdateUserRequest updateUserRequest) {
        if (updateUserRequest.getFullName() != null) {
            user.setFullname(updateUserRequest.getFullName());
        }
        if (updateUserRequest.getEmail() != null && !updateUserRequest.getEmail().isBlank()) {
            Optional<User> isUser = userRepository.findByEmail(updateUserRequest.getEmail());
            if (isUser.isPresent()){
                if (!isUser.get().getId().equals(user.getId())){
                    throw new EntityAlreadyExistsException("email already exsists!");
                }
            }
            user.setEmail(updateUserRequest.getEmail());
        }
        if (updateUserRequest.getLink() != null) {
            user.setLink(updateUserRequest.getLink());
        }
        if (updateUserRequest.getUsername() != null && !updateUserRequest.getUsername().isBlank()) {
            Optional<User> isUser = userRepository.findByUsername(updateUserRequest.getUsername());
            if (isUser.isPresent()){
                if (!isUser.get().getId().equals(user.getId())){
                    throw new EntityAlreadyExistsException("username already exsists");
                }
            }
            user.setUsername(updateUserRequest.getUsername());
        }
        if (updateUserRequest.getBio() != null) {
            user.setBio(updateUserRequest.getBio());
        }
        if (updateUserRequest.getNewPassword() != null && !updateUserRequest.getNewPassword().isBlank()) {
            if (bCryptPasswordEncoder.matches(updateUserRequest.getCurrentPassword(),user.getPassword())){
                user.setPassword(bCryptPasswordEncoder.encode(updateUserRequest.getNewPassword()));
            }else {
                throw new InvalidUsernameOrPasswordException("current password is invalid");
            }
        }
        return userRepository.save(user);
    }

    @Override
    public ImageUpdateResponseDTO updateUserImages(User user, MultipartFile profilePicture, MultipartFile coverPicture) {
        System.out.println("images are null: " + (profilePicture == null) +"    "+ (coverPicture==null));
        try {
            if (profilePicture != null && !profilePicture.isEmpty()) {
                System.out.println("images are not null:"+profilePicture.getOriginalFilename());
                String profilePictureUrl = FileStorage.saveFile(profilePicture, FileType.USER);
                user.setProfilePictureUrl(profilePictureUrl);
            }
            if (coverPicture != null && !coverPicture.isEmpty()) {
                String coverPictureUrl = FileStorage.saveFile(coverPicture,FileType.USER);
                user.setCoverPictureUrl(coverPictureUrl);
            }
        }catch (IOException e){
            throw new RuntimeException("images not updated!");
        }
        User persistedUser = userRepository.save(user);
        return ImageUpdateResponseDTO
                .builder()
                .coverPictureUrl(user.getCoverPictureUrl())
                .profilePictureUrl(user.getProfilePictureUrl())
                .build();
    }

    @Override
    public List<PostResponseDTO> getAllSavedPosts(User user, int page, int pageSize) {
        Set<String> savedPostIds = user.getSavedPosts();
        int skip = page * pageSize;
        int limit = pageSize;
        System.out.println(savedPostIds);
        return postRepository.findSavedPostsWithPagination(user.getId(), savedPostIds, skip, limit);
    }

    @Override
    public void addSavedPost(User user, String postId) {
        Post post=postRepository.findById(postId).orElseThrow(()->new EntityNotFoundException("post not found"));
        if (!user.getSavedPosts().contains(post.getId()) && !post.getSavedByUsers().contains(user.getId())){
            user.getSavedPosts().add(postId);
            post.getSavedByUsers().add(user.getId());
            postRepository.save(post);
            userRepository.save(user);
        }else{
            throw new IllegalStateException("post already saved!");
        }
    }

    @Override
    public void removeSavedPost(User user, String postId) {
        Post post=postRepository.findById(postId).orElseThrow(()->new EntityNotFoundException("post not found"));
        System.out.println(user+"   "+post);
        if (user.getSavedPosts().contains(postId) || post.getSavedByUsers().contains(user.getId())){
            user.getSavedPosts().remove(postId);
            post.getSavedByUsers().remove(user.getId());
            postRepository.save(post);
            userRepository.save(user);
        }else {
            throw new IllegalStateException("post not available to remove!");
        }
    }

//    @Override
//    public List<User> searchUsers(String pattern) {
//        if (pattern.length() <= 1) {
//            throw new IllegalArgumentException("Search pattern must be more than one character.");
//        }
//        return userRepository.searchByPattern(pattern);
//    }

    @Override
    public List<UserDescResponse> suggest() {
        return userRepository.findRandomUsers();
    }

    @Override
    public String follow(String userId, User currentUser) {
        User userToFollow = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User to follow not found!"));
        if (currentUser.getId().equals(userToFollow.getId())) {
            throw new IllegalStateException("You cannot follow yourself.");
        }
        currentUser.getFollowings().add(userToFollow.getId());
        userToFollow.getFollowers().add(currentUser.getId());
        System.out.println(currentUser);
        System.out.println(userToFollow);
        userRepository.save(currentUser);
        userRepository.save(userToFollow);
        //send notifications
        return "User followed successfully.";
    }

    @Override
    public String unfollow(String userId, User currentUser) {
        User userToUnfollow = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User to unfollow not found!"));
        if (currentUser.getId().equals(userToUnfollow.getId())) {
            throw new IllegalStateException("You cannot unfollow yourself.");
        }
        currentUser.getFollowings().remove(userToUnfollow.getId());
        userRepository.save(currentUser);
        userToUnfollow.getFollowers().remove(currentUser.getId());
        userRepository.save(userToUnfollow);
        //send notifications
        return "User unfollowed successfully.";
    }

    @Override
    public UserProfileDTO getProfile(String userId, String myid) {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found!"));
        return userRepository.findUserProfileById(userId,myid);
    }
}
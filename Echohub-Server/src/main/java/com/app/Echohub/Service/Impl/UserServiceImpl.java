package com.app.Echohub.Service.Impl;

import com.app.Echohub.DTO.Request.UpdateUserRequest;
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
        if (updateUserRequest.getEmail() != null) {
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
        if (updateUserRequest.getUsername() != null) {
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
        if (updateUserRequest.getNewPassword() != null) {
            if (bCryptPasswordEncoder.matches(updateUserRequest.getCurrentPassword(),user.getPassword())){
                user.setPassword(bCryptPasswordEncoder.encode(updateUserRequest.getNewPassword()));
            }else {
                throw new InvalidUsernameOrPasswordException("current password is invalid");
            }
        }
        return userRepository.save(user);
    }

    @Override
    public User updateUserImages(User user, MultipartFile profilePicture, MultipartFile coverPicture) {
        try {
            if (profilePicture != null && !profilePicture.isEmpty()) {
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
        return userRepository.save(user);
    }

    @Override
    public List<Post> getAllSavedPosts(User user) {
        List<Post> savedPosts = postRepository.findAllById(user.getSavedPosts());
        return savedPosts;
    }

    @Override
    public void addSavedPost(User user, String postId) {
        Post post=postRepository.findById(postId).orElseThrow(()->new EntityNotFoundException("post not found"));
        if (!user.getSavedPosts().contains(post.getId())){
            user.getSavedPosts().add(postId);
            userRepository.save(user);
        }else{
            throw new IllegalStateException("post already saved!");
        }
    }

    @Override
    public void removeSavedPost(User user, String postId) {
        Post post=postRepository.findById(postId).orElseThrow(()->new EntityNotFoundException("post not found"));
        if (user.getSavedPosts().contains(postId)){
            user.getSavedPosts().remove(postId);
            userRepository.save(user);
        }else {
            throw new IllegalStateException("post not available to remove!");
        }
    }

    @Override
    public List<User> searchUsers(String pattern) {
        if (pattern.length() <= 1) {
            throw new IllegalArgumentException("Search pattern must be more than one character.");
        }
        return userRepository.searchByPattern(pattern);
    }

}
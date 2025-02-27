package com.app.Hi5.service;

import com.app.Hi5.dto.enums.FollowStatus;
import com.app.Hi5.dto.response.UserProfileResponse;
import com.app.Hi5.dto.response.UserSearchResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.ValidationException;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.utility.FileStorage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileStorage fileStorage;

    public List<UserSearchResponse> getUsersByKeyword(String keyword, Integer page, Integer size) {
        Page<User> users = userRepository.findUsersByUsernameAndFullname(keyword, PageRequest.of(page, size));
        System.out.println(users.getContent());
        return users.getContent().stream().map(user -> UserSearchResponse.builder().id(user.getId().toHexString()).username(user.getUsername()).fullname(user.getFullname()).profilePictureUrl(user.getProfileImageUrl()).build()).collect(Collectors.toList());
    }

    public UserProfileResponse getProfile(String userId) {
//        if (ObjectId.isValid(userId)) {
//            throw new ValidationException("ObjectId is not valid.");
//        }
        return userRepository.findUserById(new ObjectId(userId)).map((searchedUser) -> UserProfileResponse.builder().id(searchedUser.getId().toHexString()).username(searchedUser.getUsername()).fullname(searchedUser.getFullname()).email(searchedUser.getEmail()).profilePictureUrl(searchedUser.getProfileImageUrl()).coverPictureUrl(searchedUser.getCoverImageUrl()).bio(searchedUser.getBio()).link(searchedUser.getLink()).createdAt(searchedUser.getCreatedAt()).followersCount((long) searchedUser.getFollowerUserIds().size()).followingsCount((long) searchedUser.getFollowingUserIds().size()).postsCount((long) searchedUser.getUserPostIds().size()).followStatus(searchedUser.getFollowerUserIds().contains(searchedUser.getId().toHexString()) ? FollowStatus.FOLLOWED : (searchedUser.getFollowRequestUserIds().contains(searchedUser.getId().toHexString()) ? FollowStatus.REQUEST_SENT : FollowStatus.NOT_FOLLOWED)).build()).orElseThrow(() -> new EntityNotFoundException("user not found!"));
    }

//    public UpdateImagesResponse updateUserImages(User user, MultipartFile profilePicture, MultipartFile coverPicture) {
//        String oldProfilePictureUrl = user.getProfileImageUrl();
//        String oldCoverPictureUrl = user.getProfileImageUrl();
//
//        try {
//            if (profilePicture != null && !profilePicture.isEmpty()) {
//                System.out.println("profile image is not null:" + profilePicture.getOriginalFilename());
//                String profilePictureUrl = fileStorage.saveFile(profilePicture, FileType.USER_PROFILE_IMAGE);
//                user.setProfileImageUrl(profilePictureUrl);
//            }
//            if (coverPicture != null && !coverPicture.isEmpty()) {
//                System.out.println("profile image is not null:" + coverPicture.getOriginalFilename());
//                String coverPictureUrl = fileStorage.saveFile(coverPicture, FileType.USER_COVER_IMAGE);
//                user.setCoverImageUrl(coverPictureUrl);
//            }
//        } catch (IOException e) {
//            throw new RuntimeException("images not updated!");
//        }
//        User persistedUser = userRepository.save(user);
//
//        if (!persistedUser.getProfileImageUrl().equals(oldProfilePictureUrl) && !oldProfilePictureUrl.equals("/user/profileImage/default.png")) {
//            try {
//                fileStorage.deleteFile(oldProfilePictureUrl);
//            } catch (IOException e) {
//                log.error("Exception occured while deleting ProfileImage:", e);
//            }
//        }
//        if (!persistedUser.getCoverImageUrl().equals(oldCoverPictureUrl) && !oldCoverPictureUrl.equals("/user/coverImage/default.png")) {
//            try {
//                fileStorage.deleteFile(oldCoverPictureUrl);
//            } catch (IOException e) {
//                log.error("Exception occured while deleting CoverImage:", e);
//            }
//        }
//        return UpdateImagesResponse.builder().profilePictureUrl(persistedUser.getProfileImageUrl()).coverPictureUrl(persistedUser.getCoverImageUrl()).build();
//    }
//
//    public void updateUser(User user, String fullName, String bio, String link, Date dob, Gender gender) {
//        user.setFullname(fullName);
//        user.setBio(bio);
//        user.setLink(link);
//        user.setDateOfBirth(dob);
//        user.setGender(gender);
//        userRepository.save(user);
//    }

//    public FollowUserResponse follow(User user, String userToFollowId) {
//        if (user.getId().toHexString().equals(userToFollowId)) {
//            throw new IllegalStateException("You cannot follow yourself.");
//        }
//
//        User userToFollow = userRepository.findById(new ObjectId(userToFollowId)).orElseThrow(() -> new EntityNotFoundException("User to follow not found!"));
//        if (userToFollow.getFollowRequestBehaviourAuto()) {
//            user.getFollowingUserIds().add(userToFollow.getId().toHexString());
//            userToFollow.getFollowerUserIds().add(user.getId().toHexString());
//
//            userRepository.save(user);
//            userRepository.save(userToFollow);
//            return FollowUserResponse.builder().isFollowed(true).isFollowRequestSent(false).message("User followed successfully.").status(HttpStatus.OK).build();
//        }
//
////        notificationService.makeFollowNotificationAndSend(user, userToFollow);
//        return FollowUserResponse.builder().isFollowed(false).isFollowRequestSent(true).message("Follow Notification send successfully.").status(HttpStatus.ACCEPTED).build();
//    }
//
//    public String unfollow(User user, String userToUnfollowId) {
//        if (user.getId().toHexString().equals(userToUnfollowId)) {
//            throw new IllegalStateException("You cannot unfollow yourself.");
//        }
//
//        User userToUnfollow = userRepository.findById(new ObjectId(userToUnfollowId)).orElseThrow(() -> new EntityNotFoundException("User to follow not found!"));
//        user.getFollowingUserIds().remove(userToUnfollow.getId().toHexString());
//        userToUnfollow.getFollowerUserIds().remove(user.getId().toHexString());
//        userRepository.save(user);
//        userRepository.save(userToUnfollow);
//
//        return "User unfollowed successfully.";
//    }

//    User getUserByEmail(String email);
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
//    UserProfileResponse getProfile(String userId, String myid);
//
//    Page<User> searchUsers(String pattern, int page, int size);

}

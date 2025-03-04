package com.app.Hi5.service;

import com.app.Hi5.dto.enums.FollowStatus;
import com.app.Hi5.dto.response.FollowUserResponse;
import com.app.Hi5.dto.response.UpdateImagesResponse;
import com.app.Hi5.dto.response.UserProfileResponse;
import com.app.Hi5.dto.response.UserSearchResponse;
import com.app.Hi5.exceptions.EntityNotFoundException;
import com.app.Hi5.exceptions.ValidationException;
import com.app.Hi5.model.Enum.Gender;
import com.app.Hi5.model.Enum.ProfileType;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.NotificationRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.utility.FileStorage;
import com.app.Hi5.utility.enums.FileType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FileStorage fileStorage;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    public List<UserSearchResponse> getUsersByKeyword(String keyword, Integer page, Integer size, User myUser) {
        Page<User> users = userRepository.findUsersByUsernameAndFullname(keyword, PageRequest.of(page, size));
        return users.getContent().stream().map(user -> UserSearchResponse.builder().id(user.getId().toHexString()).username(user.getUsername()).fullname(user.getFullname()).profilePictureUrl(user.getProfileImageUrl()).followStatus(user.getFollowerUserIds().contains(myUser.getId().toHexString()) ? FollowStatus.FOLLOWED : (user.getFollowRequestUserIds().contains(myUser.getId().toHexString()) ? FollowStatus.REQUEST_SENT : FollowStatus.NOT_FOLLOWED)).build()).collect(Collectors.toList());
    }

    public UserProfileResponse getProfile(String userId, User user) {
        if (!ObjectId.isValid(userId)) {
            throw new ValidationException("Invalid userId");
        }
        User searchedUser = userRepository.findUserById(new ObjectId(userId)).orElseThrow(() -> new EntityNotFoundException("User not found!"));
        boolean isSelf = userId.equals(user.getId().toHexString());
        boolean isFollower = searchedUser.getFollowerUserIds().contains(user.getId().toHexString());
        FollowStatus followStatus = isFollower ? FollowStatus.FOLLOWED : (searchedUser.getFollowRequestUserIds().contains(user.getId().toHexString()) ? FollowStatus.REQUEST_SENT : FollowStatus.NOT_FOLLOWED);
        if (isSelf || searchedUser.getProfileType().equals(ProfileType.PUBLIC)) {
            return buildUserProfileResponse(searchedUser, followStatus);
        }
        return buildPrivateUserProfileResponse(searchedUser, followStatus, isFollower);
    }

    private UserProfileResponse buildUserProfileResponse(User searchedUser, FollowStatus followStatus) {
        return UserProfileResponse.builder().id(searchedUser.getId().toHexString()).username(searchedUser.getUsername()).fullname(searchedUser.getFullname()).email(searchedUser.getEmail()).profilePictureUrl(searchedUser.getProfileImageUrl()).coverPictureUrl(searchedUser.getCoverImageUrl()).bio(searchedUser.getBio()).link(searchedUser.getLink()).dateOfBirth(searchedUser.getDateOfBirth()).gender(searchedUser.getGender()).followersCount((long) searchedUser.getFollowerUserIds().size()).followingsCount((long) searchedUser.getFollowingUserIds().size()).postsCount((long) searchedUser.getUserPostIds().size()).followStatus(followStatus).profileType(searchedUser.getProfileType()).build();
    }

    private UserProfileResponse buildPrivateUserProfileResponse(User searchedUser, FollowStatus followStatus, boolean isFollower) {
        return UserProfileResponse.builder().id(searchedUser.getId().toHexString()).username(searchedUser.getUsername()).fullname(searchedUser.getFullname()).email(isFollower ? searchedUser.getEmail() : null).profilePictureUrl(searchedUser.getProfileImageUrl()).coverPictureUrl(isFollower ? searchedUser.getCoverImageUrl() : "/resource/user/coverImage/default.png").bio(isFollower ? searchedUser.getBio() : null).link(isFollower ? searchedUser.getLink() : null).dateOfBirth(isFollower ? searchedUser.getDateOfBirth() : null).gender(isFollower ? searchedUser.getGender() : Gender.PREFER_NOT_TO_SAY).followersCount((long) searchedUser.getFollowerUserIds().size()).followingsCount((long) searchedUser.getFollowingUserIds().size()).postsCount((long) searchedUser.getUserPostIds().size()).followStatus(followStatus).profileType(searchedUser.getProfileType()).build();
    }

    public UpdateImagesResponse updateUserImages(User user, MultipartFile profilePicture, MultipartFile coverPicture) {
        String oldProfilePictureUrl = user.getProfileImageUrl();
        String oldCoverPictureUrl = user.getProfileImageUrl();
        try {
            if (profilePicture != null && !profilePicture.isEmpty()) {
                System.out.println("profile image is not null:" + profilePicture.getOriginalFilename());
                String profilePictureUrl = fileStorage.saveFile(profilePicture, FileType.USER_PROFILE_IMAGE);
                user.setProfileImageUrl(profilePictureUrl);
            }
            if (coverPicture != null && !coverPicture.isEmpty()) {
                System.out.println("profile image is not null:" + coverPicture.getOriginalFilename());
                String coverPictureUrl = fileStorage.saveFile(coverPicture, FileType.USER_COVER_IMAGE);
                user.setCoverImageUrl(coverPictureUrl);
            }
        } catch (IOException e) {
            throw new RuntimeException("images not updated!");
        }
        User persistedUser = userRepository.save(user);
        if (!persistedUser.getProfileImageUrl().equals(oldProfilePictureUrl) && !oldProfilePictureUrl.contains("/default.png")) {
            try {
                fileStorage.deleteFile(oldProfilePictureUrl);
            } catch (IOException e) {
                log.error("Exception occured while deleting ProfileImage:", e);
            }
        }
        if (!persistedUser.getCoverImageUrl().equals(oldCoverPictureUrl) && !oldCoverPictureUrl.contains("/default.png")) {
            try {
                fileStorage.deleteFile(oldCoverPictureUrl);
            } catch (IOException e) {
                log.error("Exception occured while deleting CoverImage:", e);
            }
        }
        return UpdateImagesResponse.builder().profilePictureUrl(persistedUser.getProfileImageUrl()).coverPictureUrl(persistedUser.getCoverImageUrl()).build();
    }

    public void updateUser(User user, String fullname, String bio, String link, Date dob, Gender gender) {
        user.setFullname(fullname);
        user.setBio(bio);
        user.setLink(link);
        user.setDateOfBirth(dob);
        user.setGender(gender);
        userRepository.save(user);
    }

    public FollowUserResponse follow(User user, String userToFollowId) {
        if (user.getId().toHexString().equals(userToFollowId)) {
            throw new IllegalStateException("You cannot follow yourself.");
        }
        User userToFollow = userRepository.findById(new ObjectId(userToFollowId)).orElseThrow(() -> new EntityNotFoundException("User to follow not found!"));
        if (userToFollow.getFollowRequestBehaviourAuto()) {
            user.getFollowingUserIds().add(userToFollow.getId().toHexString());
            userToFollow.getFollowerUserIds().add(user.getId().toHexString());
            userRepository.save(user);
            userRepository.save(userToFollow);
            notificationService.makeFollowNotificationAndSend(user, userToFollow, FollowStatus.FOLLOWED);
            return FollowUserResponse.builder().currentStatus(FollowStatus.FOLLOWED).message("User followed successfully.").status(HttpStatus.OK).build();
        } else {
            userToFollow.getFollowRequestUserIds().add(user.getId().toHexString());
            userRepository.save(userToFollow);
            notificationService.makeFollowNotificationAndSend(user, userToFollow, FollowStatus.REQUEST_SENT);
            return FollowUserResponse.builder().currentStatus(FollowStatus.REQUEST_SENT).message("Follow Notification send successfully.").status(HttpStatus.ACCEPTED).build();
        }
    }

    public FollowUserResponse unfollow(User user, String userToUnfollowId) {
        if (user.getId().toHexString().equals(userToUnfollowId)) {
            throw new IllegalStateException("You cannot unfollow yourself.");
        }
        User userToUnfollow = userRepository.findById(new ObjectId(userToUnfollowId)).orElseThrow(() -> new EntityNotFoundException("User to follow not found!"));
        user.getFollowingUserIds().remove(userToUnfollow.getId().toHexString());
        userToUnfollow.getFollowerUserIds().remove(user.getId().toHexString());
        userRepository.save(user);
        userRepository.save(userToUnfollow);
        return FollowUserResponse.builder().currentStatus(FollowStatus.NOT_FOLLOWED).message("User unfollowed successfully.").status(HttpStatus.ACCEPTED).build();
    }

    public void allowFollowRequest(String notificationId) {
        if (ObjectId.isValid(notificationId)) {
            throw new ValidationException("Invalid Id Exception");
        }
        // delete the notification   and    remove enter from followRequests   of aother user  and add enter in follower and following
    }

    public void denyFollowRequest(String notificationId) {
        if (ObjectId.isValid(notificationId)) {
            throw new ValidationException("Invalid Id Exception");
        }
        // delete the notification   and    remove enter from followRequests   of aother user  and add enter in follower and following
    }
    
//    List<UserDescResponse> suggest();

}

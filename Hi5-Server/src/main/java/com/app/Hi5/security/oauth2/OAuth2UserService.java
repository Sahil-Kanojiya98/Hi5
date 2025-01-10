package com.app.Hi5.security.oauth2;

import com.app.Hi5.exceptions.OAuth2AuthenticationProcessingException;
import com.app.Hi5.model.Enum.Gender;
import com.app.Hi5.model.Enum.IdentityProvider;
import com.app.Hi5.model.Enum.Role;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.security.oauth2.user.OAuth2UserInfo;
import com.app.Hi5.security.oauth2.user.OAuth2UserInfoFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        log.info("Loading user from OAuth2 provider: {}", oAuth2UserRequest.getClientRegistration().getClientName());
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);
        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            log.error("Authentication exception: {}", ex.getMessage());
            throw ex;
        } catch (Exception ex) {
            log.error("Error processing OAuth2 user: {}", ex.getMessage(), ex);
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) throws OAuth2AuthenticationProcessingException {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2User.getAttributes());
        log.info("Processed OAuth2 user info: {}", oAuth2UserInfo);

        if (oAuth2UserInfo.getEmail() == null || oAuth2UserInfo.getEmail().isBlank() || oAuth2UserInfo.getEmail().isEmpty()) {
            log.error("Email not found from OAuth2 provider.");
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            log.info("User found with email: {}", oAuth2UserInfo.getEmail());
            if (!(user.getIdentityProvider().equals(IdentityProvider.SELF))) {
                if (!(user.getIdentityProvider().equals(IdentityProvider.valueOf(oAuth2UserRequest.getClientRegistration().getClientName().toUpperCase())))) {
                    log.error("Identity provider mismatch for user: {}. Expected: {}, Found: {}", user.getEmail(), user.getIdentityProvider(), oAuth2UserRequest.getClientRegistration().getClientName());
                    throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " + user.getIdentityProvider() + " account. Please use your " + user.getIdentityProvider() + " account to login.");
                }
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            log.info("No user found with email: {}. Registering new user.", oAuth2UserInfo.getEmail());
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        log.info("User authentication successful for email: {}", oAuth2UserInfo.getEmail());
        return oAuth2User;
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        log.info("Registering new user with email: {}", oAuth2UserInfo.getEmail());
        User user = User.builder().email(oAuth2UserInfo.getEmail()).password(null).username("").identityProvider(IdentityProvider.valueOf(oAuth2UserRequest.getClientRegistration().getClientName().toUpperCase())).twoFactorAuthentication(false).role(Role.USER).banUntil(Date.from(Instant.now().minus(1, ChronoUnit.DAYS))).isActive(false).fullname("").bio("").dateOfBirth(new Date()).gender(Gender.PREFER_NOT_TO_SAY).profileImageUrl(oAuth2UserInfo.getImageUrl() == null ? "/profileImage/default.png" : oAuth2UserInfo.getImageUrl()).coverImageUrl("/coverImage/default.png").build();
        User savedUser = userRepository.save(user);
        log.info("New user registered with email: {}", savedUser.getEmail());
        return savedUser;
    }

    private User updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        log.info("Updating existing user with email: {}", existingUser.getEmail());
        existingUser.setProfileImageUrl((existingUser.getProfileImageUrl().equals("/profileImage/default.png") ? (oAuth2UserInfo.getImageUrl() == null ? "/profileImage/default.png" : oAuth2UserInfo.getImageUrl()) : "/profileImage/default.png"));
        User updatedUser = userRepository.save(existingUser);
        log.info("Existing user updated with email: {}", updatedUser.getEmail());
        return updatedUser;
    }
}

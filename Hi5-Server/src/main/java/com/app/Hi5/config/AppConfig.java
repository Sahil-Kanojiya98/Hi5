package com.app.Hi5.config;

import com.app.Hi5.model.Enum.*;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.UserActivityRepository;
import com.app.Hi5.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.stream.Collectors;

@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableAsync
@EnableScheduling
public class AppConfig {

    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserActivityRepository userActivityRepository;

    @Bean
    public SecureRandom secureRandom() {
        return new SecureRandom();
    }

    @PostConstruct
    public void setup() {
        try {
            if (userRepository.findByEmailAndIsActiveTrue("admin000@gmail.com").isEmpty()) {
                User user = userRepository.save(User.builder().email("admin000@gmail.com").password(passwordEncoder.encode("sksk1!SKSK")).username("admin").role(Role.ADMIN).isActive(true).gender(Gender.PREFER_NOT_TO_SAY).isAllowedNetworkPostNotification(false).isAllowedNetworkReelNotification(false).isAllowedNetworkStoryNotification(false).isAllowedPostsLikeNotification(false).isAllowedReelsLikeNotification(false).isAllowedStorysLikeNotification(false).isAllowedCommentsLikeNotification(false).isAllowedPostsCommentNotification(false).isAllowedReelsCommentNotification(false).isAllowedUsersFollowNotification(false).isAllowedUsersFollowRequestNotification(false).profileType(ProfileType.PRIVATE).build());
                log.info("Admin user created with ID: {}", user.getId());
            }

            userActivityRepository.saveAll(userActivityRepository.findAll().stream().peek(userActivity -> userActivity.setActivityStatus(ActivityStatus.OFFLINE)).collect(Collectors.toList()));

        } catch (Exception e) {
            log.error("Error occurred while setting up the default admin user: {}", e.getMessage(), e);
        }
    }

}

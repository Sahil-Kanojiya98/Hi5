package com.app.Hi5.controller;

import com.app.Hi5.dto.response.AnalyticsDataResponse;
import com.app.Hi5.dto.response.StatsResponse;
import com.app.Hi5.model.Enum.ActivityStatus;
import com.app.Hi5.model.Enum.Role;
import com.app.Hi5.repository.PostRepository;
import com.app.Hi5.repository.ReelRepository;
import com.app.Hi5.repository.UserActivityRepository;
import com.app.Hi5.repository.UserRepository;
import com.app.Hi5.service.AnalyticsService;
import com.app.Hi5.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@Slf4j
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReelRepository reelRepository;
    private final UserActivityRepository userActivityRepository;
    private final UserService userService;
    private final AnalyticsService analyticsSchedulerService;

    @GetMapping
    public AnalyticsDataResponse analyticsDataResponse() {
        return AnalyticsDataResponse.builder().totalUsers(userRepository.countByRole(Role.USER)).totalModerators(userRepository.countByRole(Role.MODERATOR)).totalPosts(postRepository.count()).totalReels(reelRepository.count()).activeUsers(userActivityRepository.countByActivityStatus(ActivityStatus.ONLINE)).bannedUsers(userRepository.countByBanUntilAfter(new Date())).userGrowthDayStatsResponse(analyticsSchedulerService.getUserCountForLast7Days()).userGrowthMonthStatsResponse(analyticsSchedulerService.getUserCountForLast12Months()).userGrowthYearStatsResponse(analyticsSchedulerService.getUserCountForLast6Years()).contentEngagementGrowthDayStatsResponse(analyticsSchedulerService.getContentImpressionsCountForLast7Days()).contentEngagementGrowthMonthStatsResponse(analyticsSchedulerService.getContentImpressionsCountForLast12Months()).contentEngagementGrowthYearStatsResponse(analyticsSchedulerService.getContentImpressionsCountForLast6Years()).build();
    }

}

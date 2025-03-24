package com.app.Hi5;

import com.app.Hi5.controller.ModerationController;
import com.app.Hi5.model.Chat;
import com.app.Hi5.model.Enum.ReportReason;
import com.app.Hi5.model.Enum.ReportType;
import com.app.Hi5.model.User;
import com.app.Hi5.repository.*;
import com.app.Hi5.service.ReportService;
import com.app.Hi5.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
class Hi5ApplicationTests {

//    @Test
//    void contextLoads() {
//    }

//    @Autowired
//    private ReportRepository reportRepository;

    @Test
    void test() {
//        System.out.println("\n \n \n \n \n ==============");
//        System.out.println(reportRepository.findReportCountsByType(ReportType.POST));
//        System.out.println(reportRepository.findReasonCountsByTypeAndRelevantId(ReportType.POST,"67df12c43d7be313ae88147c"));
//        System.out.println(reportRepository.findUsersByTypeRelevantAndReason(ReportType.POST, "67df12c43d7be313ae88147c", ReportReason.HARASSMENT_BULLYING));
    }

}

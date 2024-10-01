package com.app.Echohub.Controller;

import com.app.Echohub.DTO.PostReportDTO;
import com.app.Echohub.DTO.Request.ReportRequestDTO;
import com.app.Echohub.Model.Report;
import com.app.Echohub.Security.UserDetailsImpl;
import com.app.Echohub.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody ReportRequestDTO report, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Report createdReport = reportService.createReport(report,userDetails.getUser());
        return new ResponseEntity<>(createdReport, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<PostReportDTO> getPostReportStats(@RequestParam(defaultValue = "1") int page,
                                                  @RequestParam(defaultValue = "10") int limit) {
        // Calculate skip value: (page - 1) * limit
        int skip = (page - 1) * limit;
        return reportService.getPostReportStats(skip, limit);
    }


}
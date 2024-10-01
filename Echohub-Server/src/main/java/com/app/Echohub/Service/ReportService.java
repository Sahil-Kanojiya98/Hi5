package com.app.Echohub.Service;

import com.app.Echohub.DTO.PostReportDTO;
import com.app.Echohub.DTO.Request.ReportRequestDTO;
import com.app.Echohub.Model.Report;
import com.app.Echohub.Model.User;

import java.util.List;

public interface ReportService {
    Report createReport(ReportRequestDTO report, User user);

    List<PostReportDTO> getPostReportStats(int skip, int limit);
}

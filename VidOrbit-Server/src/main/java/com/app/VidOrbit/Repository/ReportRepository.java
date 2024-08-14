package com.app.VidOrbit.Repository;

import com.app.VidOrbit.Model.Report;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReportRepository extends MongoRepository<Report, String> {
}

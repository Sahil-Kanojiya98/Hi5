package com.app.Echohub.Model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Document(collection = "reports")
public class Report {

    @Id
    private String id;

    @Indexed
    @Field("post_id")
    private String postId;

    @Indexed
    @Field("reported_by")
    private String reportedBy;

    @Indexed
    private ReportReason reason; // Change this to use the ReportReason enum

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

}

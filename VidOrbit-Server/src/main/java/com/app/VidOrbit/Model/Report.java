package com.app.VidOrbit.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "reports")
public class Report {
    @Id
    private String id;

    @DBRef(lazy = true)
    private User reporter;

    @DBRef(lazy = true)
    private Video video;

    @DBRef(lazy = true)
    private Comment comment;

    private String reason;
    private String status;   // pending, reviewed, resolved

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

}

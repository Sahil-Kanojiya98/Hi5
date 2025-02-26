package com.app.Hi5.model;

import com.app.Hi5.model.Enum.ActivityStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "user_activity")
public class UserActivity {

    @Id
    private ObjectId id;

    @Field("user")
    private String userId;

    @Field("activity_status")
    private ActivityStatus activityStatus;

    @Field("last_active_time")
    private Date lastActiveTime;

}

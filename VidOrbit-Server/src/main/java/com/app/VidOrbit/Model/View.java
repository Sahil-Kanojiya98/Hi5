package com.app.VidOrbit.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "views")
public class View {

    @Id
    private String id;

    @DBRef(lazy = true)
    private Video video;

    @DBRef(lazy = true)
    private User user;

    private LocalDateTime viewedAt;


}
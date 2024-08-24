package com.app.VidOrbit.Model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.LinkedList;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "tags")
public class Tag {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;

    @DBRef
    private List<Video> videos=new LinkedList<>();
}

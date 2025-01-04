//package com.app.Echohub.model;
//
//import lombok.*;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.index.Indexed;
//import org.springframework.data.mongodb.core.mapping.Document;
//import org.springframework.data.mongodb.core.mapping.Field;
//
//import java.util.Date;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Getter
//@Setter
//@Builder
//@Document(collection = "refresh_tokens")
//public class RefreshToken {
//
//    @Id
//    private String id;
//
//    @Indexed(unique = true)
//    private String token;
//
//    @Field("expiry_date")
//    private Date expiryDate;
//
//    private String username;
//
//}

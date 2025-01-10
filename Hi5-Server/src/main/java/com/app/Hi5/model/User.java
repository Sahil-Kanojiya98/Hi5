package com.app.Hi5.model;

import com.app.Hi5.model.Enum.Gender;
import com.app.Hi5.model.Enum.IdentityProvider;
import com.app.Hi5.model.Enum.Role;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "user")
public class User {

    //  Primary Details
    @Id
    private ObjectId id;

    @Field("email")
    @Indexed(unique = true)
    private String email;

    @Field("password")
    private String password;

    @Field("username")
    @Indexed(unique = true)
    private String username;

    @Field("identity_provider")
    private IdentityProvider identityProvider;

    @Field("account_created_at")
    @CreatedDate
    private Date accountCreatedAt;

    @Field("two_factor_authentication")
    private Boolean twoFactorAuthentication;

    //  Access Grants (Role)
    @Field("role")
    private Role role;

    @Field("ban_until")
    private Date banUntil;

    @Field("active")
    private Boolean isActive;

    //  User Details
    @Field("fullname")
    private String fullname;

    @Field("bio")
    private String bio;

    @Field("date_of_birth")
    private Date dateOfBirth;

    @Field("gender")
    private Gender gender;

    @Field("profile_image_url")
    private String profileImageUrl;

    @Field(value = "cover_image_url")
    private String coverImageUrl;


//      User Activity Data
    @Field("followers")
    @Builder.Default
    private Set<String> followerIds = new HashSet<>();

    @Field("followings")
    @Builder.Default
    private Set<String> followingIds = new HashSet<>();

    @Field("posts")
    @Builder.Default
    private Set<String> postIds = new HashSet<>();

    @Field("saved_posts")
    @Builder.Default
    private Set<String> savedPostIds = new HashSet<>();

}
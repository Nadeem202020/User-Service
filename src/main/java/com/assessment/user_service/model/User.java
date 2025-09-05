package com.assessment.user_service.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "users")
@NoArgsConstructor
public class User {

    /**
     * The unique identifier for the user.
     */
    @Id
    private String id;

    /**
     * The name of the user.
     */
    private String name;

    /**
     * The email of the user. This is unique.
     */
    @Indexed(unique = true)
    private String email;

    /**
     * The age of the user.
     */
    private Integer age;

    /**
     * The timestamp of when the user was created.
     */
    @CreatedDate
    private Instant createdAt;

    /**
     * The timestamp of when the user was last updated.
     */
    @LastModifiedDate
    private Instant updatedAt;

    /**
     * Constructs a new User with the given name, email, and age.
     * @param name The name of the user.
     * @param email The email of the user.
     * @param age The age of the user.
     */
    public User(String name, String email, Integer age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
}

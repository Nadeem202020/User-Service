package com.assessment.user_service.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.assessment.user_service.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Finds a user by their email.
     * @param email The email to search for.
     * @return An optional containing the user if found, or empty otherwise.
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks if a user exists with the given email.
     * @param email The email to check.
     * @return True if a user with the given email exists, false otherwise.
     */
    boolean existsByEmail(String email);

    /**
     * Checks if a user exists with the given email and a different ID.
     * @param email The email to check.
     * @param userId The ID to exclude from the check.
     * @return True if a user with the given email and a different ID exists, false otherwise.
     */
    boolean existsByEmailAndIdNot(String email, String userId);

}

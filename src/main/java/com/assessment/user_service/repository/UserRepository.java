package com.assessment.user_service.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.assessment.user_service.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, String userId);

}

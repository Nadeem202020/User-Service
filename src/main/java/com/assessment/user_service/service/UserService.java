package com.assessment.user_service.service;

import com.assessment.user_service.dto.CreateUserRequest;
import com.assessment.user_service.dto.UpdateUserRequest;
import com.assessment.user_service.exception.EmailAlreadyExistsException;
import com.assessment.user_service.exception.ResourceNotFoundException;
import com.assessment.user_service.model.User;
import com.assessment.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(CreateUserRequest request) {
        // 1. Perform the check BEFORE attempting to create the user
        if (userRepository.existsByEmail(request.getEmail())) {
            // 2. If the email exists, throw our specific, user-friendly exception
            throw new EmailAlreadyExistsException("An account with email '" + request.getEmail() + "' already exists.");
        }

        // 3. If the check passes, proceed with creating and saving the user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAge(request.getAge());

        return userRepository.save(user);
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User updateUser(String id, UpdateUserRequest userDetails) {
        // 1. Find the existing user or throw an exception
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // 2. Update non-email fields (if they are provided in the request)
        if (userDetails.getName() != null) {
            user.setName(userDetails.getName());
        }
        if (userDetails.getAge() != null) {
            user.setAge(userDetails.getAge());
        }

        // 3. Handle the email update with careful validation
        String newEmail = userDetails.getEmail();
        // Check if a new email was provided AND if it's different from the current one
        if (newEmail != null && !newEmail.equalsIgnoreCase(user.getEmail())) {

            // Use our new repository method to check if this email is taken by SOMEONE ELSE
            if (userRepository.existsByEmailAndIdNot(newEmail, id)) {
                throw new EmailAlreadyExistsException("Email '" + newEmail + "' is already in use by another account.");
            }

            // If the check passes, update the email
            user.setEmail(newEmail);
        }

        // 4. Save the updated user to the database
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

}

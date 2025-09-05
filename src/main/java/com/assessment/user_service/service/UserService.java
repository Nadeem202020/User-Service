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

    /**
     * Creates a new user.
     * @param request The request containing the user's details.
     * @return The created user.
     * @throws EmailAlreadyExistsException if the email already exists.
     */
    public User createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("An account with email '" + request.getEmail() + "' already exists.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAge(request.getAge());

        return userRepository.save(user);
    }

    /**
     * Returns a paginated list of all users.
     * @param pageable The pagination information.
     * @return A paginated list of users.
     */
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    /**
     * Returns a user by their ID.
     * @param id The ID of the user to retrieve.
     * @return An optional containing the user if found, or empty otherwise.
     */
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    /**
     * Updates a user.
     * @param id The ID of the user to update.
     * @param userDetails The request containing the updated user details.
     * @return The updated user.
     * @throws ResourceNotFoundException if the user is not found.
     * @throws EmailAlreadyExistsException if the new email is already in use by another account.
     */
    public User updateUser(String id, UpdateUserRequest userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (userDetails.getName() != null) {
            user.setName(userDetails.getName());
        }
        if (userDetails.getAge() != null) {
            user.setAge(userDetails.getAge());
        }

        String newEmail = userDetails.getEmail();
        if (newEmail != null && !newEmail.equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmailAndIdNot(newEmail, id)) {
                throw new EmailAlreadyExistsException("Email '" + newEmail + "' is already in use by another account.");
            }
            user.setEmail(newEmail);
        }

        return userRepository.save(user);
    }

    /**
     * Deletes a user.
     * @param id The ID of the user to delete.
     * @throws ResourceNotFoundException if the user is not found.
     */
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

}

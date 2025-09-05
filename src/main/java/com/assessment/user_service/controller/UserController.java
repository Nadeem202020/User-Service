package com.assessment.user_service.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.assessment.user_service.dto.CreateUserRequest;
import com.assessment.user_service.dto.UpdateUserRequest;
import com.assessment.user_service.model.User;
import com.assessment.user_service.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Creates a new user.
     * @param request The request body containing the user's details.
     * @return The created user.
     */
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody CreateUserRequest request) {
        User savedUser = userService.createUser(request);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    /**
     * Returns a paginated list of all users.
     * @param page The page number to retrieve.
     * @param size The number of users per page.
     * @return A paginated list of users.
     */
    @GetMapping
    public Page<User> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.getAllUsers(pageable);
    }

    /**
     * Returns a user by their ID.
     * @param id The ID of the user to retrieve.
     * @return The user with the specified ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Updates a user.
     * @param id The ID of the user to update.
     * @param request The request body containing the updated user details.
     * @return The updated user.
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @Valid @RequestBody UpdateUserRequest request) {
        User updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Deletes a user.
     * @param id The ID of the user to delete.
     * @return A confirmation message.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User with ID " + id + " has been deleted successfully.");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}

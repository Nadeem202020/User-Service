package com.assessment.user_service.service;

import com.assessment.user_service.dto.CreateUserRequest;
import com.assessment.user_service.exception.EmailAlreadyExistsException;
import com.assessment.user_service.model.User;
import com.assessment.user_service.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class) // Initializes Mockito
class UserServiceTest {

    @Mock // Mockito will create a fake instance of UserRepository
    private UserRepository userRepository;

    @InjectMocks // Mockito will create an instance of UserService and inject the mocks into it
    private UserService userService;

    private CreateUserRequest createUserRequest;

    @BeforeEach
    void setUp() {
        // Create a sample request DTO to use in tests
        createUserRequest = new CreateUserRequest();
        createUserRequest.setName("Test User");
        createUserRequest.setEmail("test@example.com");
        createUserRequest.setAge(25);
    }

    @Test
    void whenCreateUser_withNonExistingEmail_shouldReturnNewUser() {
        // Given (Setup)
        // 1. We tell the mock repository what to do when its methods are called.
        given(userRepository.existsByEmail(createUserRequest.getEmail())).willReturn(false);

        User savedUser = new User();
        savedUser.setId("123");
        savedUser.setName(createUserRequest.getName());
        savedUser.setEmail(createUserRequest.getEmail());
        given(userRepository.save(any(User.class))).willReturn(savedUser);

        // When (Action)
        // 2. We call the actual method we want to test.
        User createdUser = userService.createUser(createUserRequest);

        // Then (Assertion)
        // 3. We check if the result is what we expected.
        assertThat(createdUser).isNotNull();
        assertThat(createdUser.getEmail()).isEqualTo("test@example.com");

        // We can also verify that certain methods on our mocks were called.
        verify(userRepository).save(any(User.class));
    }

    @Test
    void whenCreateUser_withExistingEmail_shouldThrowException() {
        // Given
        // Tell the mock repository that this email already exists.
        given(userRepository.existsByEmail(createUserRequest.getEmail())).willReturn(true);

        // When & Then
        // Assert that calling the method throws the correct exception.
        assertThrows(EmailAlreadyExistsException.class, () -> {
            userService.createUser(createUserRequest);
        });
    }
}

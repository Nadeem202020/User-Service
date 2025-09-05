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

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private CreateUserRequest createUserRequest;

    @BeforeEach
    void setUp() {
        createUserRequest = new CreateUserRequest();
        createUserRequest.setName("Test User");
        createUserRequest.setEmail("test@example.com");
        createUserRequest.setAge(25);
    }

    @Test
    void whenCreateUser_withNonExistingEmail_shouldReturnNewUser() {
        given(userRepository.existsByEmail(createUserRequest.getEmail())).willReturn(false);

        User savedUser = new User();
        savedUser.setId("123");
        savedUser.setName(createUserRequest.getName());
        savedUser.setEmail(createUserRequest.getEmail());
        given(userRepository.save(any(User.class))).willReturn(savedUser);

        User createdUser = userService.createUser(createUserRequest);

        assertThat(createdUser).isNotNull();
        assertThat(createdUser.getEmail()).isEqualTo("test@example.com");

        verify(userRepository).save(any(User.class));
    }

    @Test
    void whenCreateUser_withExistingEmail_shouldThrowException() {
        given(userRepository.existsByEmail(createUserRequest.getEmail())).willReturn(true);

        assertThrows(EmailAlreadyExistsException.class, () -> {
            userService.createUser(createUserRequest);
        });
    }
}

package com.assessment.user_service.controller;

import com.assessment.user_service.dto.CreateUserRequest;
import com.assessment.user_service.model.User;
import com.assessment.user_service.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest // Loads the full application context
@AutoConfigureMockMvc // Configures MockMvc for sending requests
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc; // The tool for making fake API calls

    @Autowired
    private ObjectMapper objectMapper; // For converting Java objects to JSON strings

    @MockBean // Replaces the real UserService bean with a mock for this test
    private UserService userService;

    @Test
    @WithMockUser // Bypasses JWT security by simulating a logged-in user
    void whenPostUsers_withValidData_shouldReturn201Created() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest();
        request.setName("API Test User");
        request.setEmail("api.test@example.com");
        request.setAge(30);

        User returnedUser = new User();
        returnedUser.setId("new-user-id");
        returnedUser.setName(request.getName());
        returnedUser.setEmail(request.getEmail());

        // We mock the service layer's behavior
        given(userService.createUser(any(CreateUserRequest.class))).willReturn(returnedUser);

        // When & Then
        mockMvc.perform(post("/users") // Perform a POST request
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))) // Set the request body
                .andExpect(status().isCreated()) // Assert the HTTP status is 201
                .andExpect(jsonPath("$.id").value("new-user-id")) // Assert fields in the JSON response
                .andExpect(jsonPath("$.name").value("API Test User"));
    }

    @Test
    void whenPostUsers_withoutAuth_shouldReturn403Forbidden() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest();
        request.setName("Forbidden User");
        request.setEmail("forbidden@example.com");

        // When & Then
        // We do NOT use @WithMockUser, so the request is anonymous
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden()); // Assert the HTTP status is 403
    }
}

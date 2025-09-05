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

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    @WithMockUser
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

        given(userService.createUser(any(CreateUserRequest.class))).willReturn(returnedUser);

        // When & Then
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("new-user-id"))
                .andExpect(jsonPath("$.name").value("API Test User"));
    }

    @Test
    void whenPostUsers_withoutAuth_shouldReturn403Forbidden() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest();
        request.setName("Forbidden User");
        request.setEmail("forbidden@example.com");

        // When & Then
        mockMvc.perform(post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}

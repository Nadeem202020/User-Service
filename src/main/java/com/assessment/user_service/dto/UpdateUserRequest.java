package com.assessment.user_service.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserRequest {

    private String name;

    @Email(message = "Email should be valid")
    private String email;

    private Integer age;

}

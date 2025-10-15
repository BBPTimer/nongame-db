package com.nongame.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserProfileRequestDTO {
    @NotNull(message = "Email is required")
    @Email(message = "Provide valid email address")
    @Size(max = 254, message = "Email address may not exceed 254 characters")
    private String email;

    @NotNull(message = "Password is required")
    @Size(min = 8, max = 72, message = "Password should be between 8 and 72 characters")
    private String password;

    public UserProfileRequestDTO() {
    }

    public UserProfileRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

package com.nongame.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDTO {
    @NotBlank(message="Username is required.")
    @Size(min=2, max=20, message="Username must be 2-20 characters long.")
    private String username;

    @NotBlank(message = "Password is required.")
    @Size(min=8, max=20, message="Password must be 8-20 characters long.")
    private String password;

    public UserDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

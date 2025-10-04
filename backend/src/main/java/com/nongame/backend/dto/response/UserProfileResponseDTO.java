package com.nongame.backend.dto.response;

public class UserProfileResponseDTO {
    private String email;

    public UserProfileResponseDTO() {
    }

    public UserProfileResponseDTO(String email, String name) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

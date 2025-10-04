package com.nongame.backend.dto;

public class UserProfileDTO {
    private String email;
    private String password;

    public UserProfileDTO() {
    }

    public UserProfileDTO(String email, String password) {
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

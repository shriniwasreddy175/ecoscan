package com.project.ecoscan_backend.dtos;

public class AuthResponseDTO {
    private String message;
    private UserProfileDTO user;

    public AuthResponseDTO() {}

    public AuthResponseDTO(String message, UserProfileDTO user) {
        this.message = message;
        this.user = user;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserProfileDTO getUser() { return user; }
    public void setUser(UserProfileDTO user) { this.user = user; }
}
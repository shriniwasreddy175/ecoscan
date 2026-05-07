package com.project.ecoscan_backend.dtos;

public class AuthResponseDTO {
    private String token;
    private String message;
    private UserProfileDTO user;

    public AuthResponseDTO() {}

    public AuthResponseDTO(String token, String message, UserProfileDTO user) {
        this.token = token;
        this.message = message;
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public UserProfileDTO getUser() { return user; }
    public void setUser(UserProfileDTO user) { this.user = user; }
}
package com.safety.backend.dto;

public class AdminLoginResponse {
    private boolean authenticated;
    private String username;
    private String role;
    private String token;

    public AdminLoginResponse() {}

    public AdminLoginResponse(boolean authenticated, String username, String role, String token) {
        this.authenticated = authenticated;
        this.username = username;
        this.role = role;
        this.token = token;
    }

    public boolean isAuthenticated() { return authenticated; }
    public void setAuthenticated(boolean authenticated) { this.authenticated = authenticated; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}

package com.safety.backend.dto;

public class AdminLoginRequest {
    private String pin;
    private String username;
    private String password;

    public AdminLoginRequest() {}

    public String getPin() { return pin; }
    public void setPin(String pin) { this.pin = pin; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

package com.safety.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = Map.of(
            "service", "QR Safety Reporting System Backend API",
            "status", "UP & RUNNING",
            "database", "Cloud PostgreSQL Connected",
            "version", "1.0.0",
            "endpoints", Map.of(
                "reports", "/api/reports",
                "adminStats", "/api/admin/stats",
                "adminLogin", "/api/admin/login"
            )
        );
        return ResponseEntity.ok(response);
    }
}

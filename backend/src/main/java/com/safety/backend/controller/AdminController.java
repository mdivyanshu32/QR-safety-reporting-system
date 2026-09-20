package com.safety.backend.controller;

import com.safety.backend.dto.*;
import com.safety.backend.model.Report;
import com.safety.backend.service.AdminService;
import com.safety.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;

    @Autowired
    public AdminController(AdminService adminService, ReportService reportService) {
        this.adminService = adminService;
        this.reportService = reportService;
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponse> login(@RequestBody AdminLoginRequest request) {
        AdminLoginResponse response = adminService.authenticateAdmin(request);
        if (response.isAuthenticated()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ReportResponseDTO>> getReports(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String division) {
        return ResponseEntity.ok(reportService.getAllReports(type, status, division));
    }

    @PutMapping("/reports/{id}/action")
    public ResponseEntity<Report> updateReportAction(
            @PathVariable Long id,
            @RequestBody CorrectiveActionRequest request) {
        Report updated = adminService.updateReportStatusAndAction(id, request);
        return ResponseEntity.ok(updated);
    }
}

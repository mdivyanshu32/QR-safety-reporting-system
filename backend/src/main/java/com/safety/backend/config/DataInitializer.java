package com.safety.backend.config;

import com.safety.backend.dto.ReportSubmissionRequest;
import com.safety.backend.model.AdminUser;
import com.safety.backend.repository.AdminUserRepository;
import com.safety.backend.service.AdminService;
import com.safety.backend.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final ReportService reportService;
    private final AdminService adminService;

    @Autowired
    public DataInitializer(AdminUserRepository adminUserRepository,
                            ReportService reportService,
                            AdminService adminService) {
        this.adminUserRepository = adminUserRepository;
        this.reportService = reportService;
        this.adminService = adminService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin
        if (adminUserRepository.findByUsername("admin").isEmpty()) {
            AdminUser admin = new AdminUser("admin", "admin123", "8888", "ADMIN");
            adminUserRepository.save(admin);
        }

        // Seed Sample Reports
        if (reportService.getAllReports(null, null, null).isEmpty()) {
            // 1. Tool Report
            ReportSubmissionRequest r1 = new ReportSubmissionRequest();
            r1.setType("TOOL");
            r1.setEmployeeId("EMP-7842");
            r1.setEmployeeName("Rajesh Kumar");
            r1.setEmployeePhone("+91 9876543210");
            r1.setLocation("Substation 33kV - South Delhi");
            r1.setDivision("South Delhi");
            r1.setSubdivision("Okhla Phase 3");
            r1.setActivity("Transformer Bushing Maintenance");
            r1.setToolType("Crimping Tool");
            r1.setProblemType("Hydraulic Leakage / Loose Jaw");
            r1.setDescription("Crimping tool jaw slipped during 240 sq mm cable lug crimping. Hydraulic oil seepage noticed.");
            r1.setSeverity("MEDIUM");
            reportService.createReport(r1);

            // 2. PPE Report
            ReportSubmissionRequest r2 = new ReportSubmissionRequest();
            r2.setType("PPE");
            r2.setEmployeeId("EMP-4109");
            r2.setEmployeeName("Amit Sharma");
            r2.setEmployeePhone("+91 9123456789");
            r2.setLocation("Feeder 11kV - Janakpuri");
            r2.setDivision("West Delhi");
            r2.setSubdivision("Janakpuri Sub Division");
            r2.setActivity("Overhead Line Inspection");
            r2.setPpeItem("Safety Gloves (11kV Insulated)");
            r2.setIssueType("Puncture / Micro Cracks");
            r2.setDescription("Insulated electrical gloves showed hairline crack during visual air test before climbing pole.");
            r2.setSeverity("HIGH");
            reportService.createReport(r2);

            // 3. Near Miss Report
            ReportSubmissionRequest r3 = new ReportSubmissionRequest();
            r3.setType("NEAR_MISS");
            r3.setEmployeeId("EMP-9021");
            r3.setEmployeeName("Suresh Verma");
            r3.setEmployeePhone("+91 9988776655");
            r3.setLocation("Substation 66kV - Nehru Place");
            r3.setDivision("South Delhi");
            r3.setSubdivision("Nehru Place Grid");
            r3.setActivity("Circuit Breaker Maintenance");
            r3.setPotentialHazard("Flashover risk due to ungrounded busbar nearby");
            r3.setImmediateAction("Applied earth discharge rod immediately and verified line isolate isolation before proceeding.");
            r3.setDescription("Line disconnect switch auxiliary indicator gave false open signal while blade was partially touching terminal.");
            r3.setSeverity("HIGH");
            r3.setRawVoiceTranscript("Nehru Place grid substation par 66kV isolator indicator galat open dikha raha tha. Humne pehle discharge rod lagaya fir kaam roka.");
            r3.setStructuredVoiceJson("{\"location\":\"Nehru Place Grid\", \"hazard\":\"False Isolator Signal\", \"actionTaken\":\"Applied discharge rod\"}");
            reportService.createReport(r3);

            // 4. Incident Report
            ReportSubmissionRequest r4 = new ReportSubmissionRequest();
            r4.setType("INCIDENT");
            r4.setEmployeeId("EMP-3320");
            r4.setEmployeeName("Vikram Singh");
            r4.setEmployeePhone("+91 9543210987");
            r4.setLocation("11kV Distribution Transformer - Dwarka Sec 10");
            r4.setDivision("West Delhi");
            r4.setSubdivision("Dwarka Division");
            r4.setActivity("LT Fuse Replacement");
            r4.setEquipmentInvolved("11kV/415V 400kVA DT Box");
            r4.setInjured(false);
            r4.setWorkStopped(true);
            r4.setImmediateAction("Substation breaker tripped safely. Area barricaded with caution tape.");
            r4.setWitnessDetails("Helper Manoj Kumar, Supervisor Rakesh Chawla");
            r4.setDescription("Heavy sparking occurred inside LT distribution box during fuse installation due to insulation failure on neutral cable.");
            r4.setSeverity("HIGH");
            reportService.createReport(r4);

            // 5. Accident Report
            ReportSubmissionRequest r5 = new ReportSubmissionRequest();
            r5.setType("ACCIDENT");
            r5.setEmployeeId("EMP-1104");
            r5.setEmployeeName("Dharmendra Yadav");
            r5.setEmployeePhone("+91 9711223344");
            r5.setLocation("Pole No. 42 - Karol Bagh");
            r5.setDivision("Central Delhi");
            r5.setSubdivision("Karol Bagh Circle");
            r5.setActivity("Cable Jointing & Pole Climbing");
            r5.setInjuryOccurred(true);
            r5.setBodyPart("Right Forearm & Wrist");
            r5.setInjuryType("Minor Arc Flash Burn & Abrasion");
            r5.setFirstAid(true);
            r5.setHospitalRequired(false);
            r5.setWitnessDetails("Lineman Helper Sunil Pal");
            r5.setImmediateAction("Applied burn spray and first-aid bandage. Worker shifted to resting tent.");
            r5.setDescription("Arc flash occurred when faulty jumper cable touched cross-arm metal frame during tightening.");
            r5.setSeverity("CRITICAL");
            reportService.createReport(r5);
        }
    }
}

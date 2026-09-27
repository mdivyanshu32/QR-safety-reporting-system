package com.safety.backend.controller;

import com.safety.backend.model.EmergencyContact;
import com.safety.backend.repository.EmergencyContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "*")
public class EmergencyContactController {

    private final EmergencyContactRepository repository;

    @Autowired
    public EmergencyContactController(EmergencyContactRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<EmergencyContact> getAllContacts(@RequestParam(required = false) String area) {
        if (repository.count() == 0) {
            seedDefaultContacts();
        }
        if (area != null && !area.isBlank()) {
            return repository.findByArea(area);
        }
        return repository.findAll();
    }

    @PostMapping
    public EmergencyContact saveContact(@RequestBody EmergencyContact contact) {
        return repository.save(contact);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    private void seedDefaultContacts() {
        List<EmergencyContact> seeds = Arrays.asList(
            new EmergencyContact("South Delhi", "Control Room", "Okhla 220kV Main Dispatch Control Room", "+91-11-26910022", "1800-11-9090", "Phase 3 Industrial Area, Okhla, New Delhi"),
            new EmergencyContact("South Delhi", "Ambulance", "Max Healthcare Emergency Trauma Ambulance", "102", "+91-11-66611000", "Saket Institutional Area, New Delhi"),
            new EmergencyContact("South Delhi", "Fire Station", "Nehru Place Fire Headquarters", "101", "+91-11-26438888", "Nehru Place, New Delhi"),
            new EmergencyContact("South Delhi", "Safety Officer", "Er. Rajesh Sharma (Lead Safety Head)", "+91-98100-22119", "+91-98100-22120", "South Circle Safety Cell"),

            new EmergencyContact("West Delhi", "Control Room", "Janakpuri 66kV Grid Control Room", "+91-11-25501144", "1800-11-9091", "Block B, Janakpuri, New Delhi"),
            new EmergencyContact("West Delhi", "Ambulance", "Deen Dayal Upadhyay Hospital Emergency", "102", "+91-11-25494401", "Hari Nagar, New Delhi"),
            new EmergencyContact("West Delhi", "Safety Officer", "Er. Vikram Singh (Safety Inspection Officer)", "+91-98711-33445", "+91-98711-33446", "West Zone Safety Cell"),

            new EmergencyContact("Central Delhi", "Control Room", "Minto Road Grid Control Room", "+91-11-23238877", "1800-11-9092", "Minto Road, New Delhi"),
            new EmergencyContact("Central Delhi", "Fire Station", "Connaught Place Fire Station", "101", "+91-11-23412222", "Barakhamba Road, New Delhi"),

            new EmergencyContact("East Delhi", "Control Room", "Mayur Vihar 66kV Grid Dispatch", "+91-11-22719900", "1800-11-9093", "Phase 1, Mayur Vihar, New Delhi"),
            new EmergencyContact("North Delhi", "Control Room", "Model Town 33kV Line Inspector HQ", "+91-11-27415533", "1800-11-9094", "Model Town, New Delhi")
        );
        repository.saveAll(seeds);
    }
}

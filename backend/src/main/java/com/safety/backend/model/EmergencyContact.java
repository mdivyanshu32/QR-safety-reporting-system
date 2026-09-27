package com.safety.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_contacts")
public class EmergencyContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String area; // e.g. South Delhi, West Delhi, Central Delhi, East Delhi, North Delhi

    @Column(nullable = false)
    private String contactType; // Control Room, Fire Station, Ambulance, Safety Officer, Substation In-Charge

    @Column(nullable = false)
    private String title; // e.g. Okhla 220kV Substation Control Room

    @Column(nullable = false)
    private String phone;

    private String alternatePhone;

    private String address;

    private LocalDateTime updatedAt;

    public EmergencyContact() {}

    public EmergencyContact(String area, String contactType, String title, String phone, String alternatePhone, String address) {
        this.area = area;
        this.contactType = contactType;
        this.title = title;
        this.phone = phone;
        this.alternatePhone = alternatePhone;
        this.address = address;
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getContactType() { return contactType; }
    public void setContactType(String contactType) { this.contactType = contactType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAlternatePhone() { return alternatePhone; }
    public void setAlternatePhone(String alternatePhone) { this.alternatePhone = alternatePhone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

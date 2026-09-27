package com.safety.backend.service;

import com.safety.backend.model.Report;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.recipient:divyanshmishra55432@gmail.com}")
    private String defaultRecipient;

    @Value("${spring.mail.username:noreply@safetyportal.com}")
    private String fromEmail;

    @Autowired(required = false)
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendReportNotificationEmail(Report report, String customRecipient) {
        String recipient = (customRecipient != null && !customRecipient.isBlank()) ? customRecipient : defaultRecipient;
        String subject = String.format("🚨 [%s SAFETY ALERT] %s - %s (%s)",
                report.getSeverity(), report.getReportNumber(), report.getType(), report.getLocation());

        String htmlBody = buildHtmlEmailContent(report);

        System.out.println("=================================================");
        System.out.println("📩 TRIGGERING EMAIL NOTIFICATION TO: " + recipient);
        System.out.println("SUBJECT: " + subject);
        System.out.println("=================================================");

        if (mailSender == null) {
            System.out.println("INFO: JavaMailSender not configured. Email logged to console.");
            return true;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            System.out.println("✅ EMAIL SENT SUCCESSFULLY TO " + recipient);
            return true;
        } catch (Exception e) {
            System.err.println("WARN: Failed to send SMTP email (logged instead): " + e.getMessage());
            return false;
        }
    }

    private String buildHtmlEmailContent(Report report) {
        return "<html>" +
                "<body style='font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px;'>" +
                "<div style='max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 25px; border: 2px solid #f59e0b;'>" +
                "<h2 style='color: #f59e0b; margin-top: 0;'>⚡ ELECTRICAL SAFETY INCIDENT ALERT</h2>" +
                "<p style='font-size: 14px; color: #cbd5e1;'>A new safety report has been logged in the portal.</p>" +
                "<hr style='border-color: #334155;' />" +
                "<table style='width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;'>" +
                "<tr><td style='padding: 8px; color: #94a3b8;'>Ticket ID:</td><td style='padding: 8px; font-weight: bold; color: #f59e0b;'>" + report.getReportNumber() + "</td></tr>" +
                "<tr><td style='padding: 8px; color: #94a3b8;'>Category:</td><td style='padding: 8px; font-weight: bold; color: #ffffff;'>" + report.getType() + "</td></tr>" +
                "<tr><td style='padding: 8px; color: #94a3b8;'>Severity:</td><td style='padding: 8px; font-weight: bold; color: #ef4444;'>" + report.getSeverity() + "</td></tr>" +
                "<tr><td style='padding: 8px; color: #94a3b8;'>Field Worker:</td><td style='padding: 8px; color: #ffffff;'>" + (report.getEmployeeName() != null ? report.getEmployeeName() : "Field Lineman") + " (" + report.getEmployeeId() + ")</td></tr>" +
                "<tr><td style='padding: 8px; color: #94a3b8;'>Substation/Location:</td><td style='padding: 8px; color: #ffffff;'>" + report.getLocation() + " (" + report.getDivision() + ")</td></tr>" +
                "<tr><td style='padding: 8px; color: #94a3b8;'>Date & Time:</td><td style='padding: 8px; color: #ffffff;'>" + report.getDate() + " at " + report.getTime() + "</td></tr>" +
                "</table>" +
                "<div style='margin-top: 15px; background-color: #0f172a; padding: 15px; border-radius: 8px; border: 1px solid #334155;'>" +
                "<strong style='color: #f59e0b;'>Event Description:</strong>" +
                "<p style='color: #e2e8f0; font-style: italic; margin-top: 5px;'>" + (report.getDescription() != null ? report.getDescription() : "Safety report submitted") + "</p>" +
                "</div>" +
                "<p style='font-size: 12px; color: #64748b; margin-top: 20px; text-align: center;'>Official QR Safety Portal • Action Required</p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }
}

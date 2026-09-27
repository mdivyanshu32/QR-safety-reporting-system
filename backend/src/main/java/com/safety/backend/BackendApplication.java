package com.safety.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        // Auto-sanitize raw PostgreSQL URLs for Java JDBC compatibility
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getProperty("spring.datasource.url");
        }

        if (dbUrl != null && !dbUrl.isBlank()) {
            // Strip libpq specific parameters that PostgreSQL JDBC driver rejects
            dbUrl = dbUrl.replace("&channel_binding=require", "").replace("?channel_binding=require", "");

            // Prepend jdbc: prefix required by Java JDBC Driver
            if (dbUrl.startsWith("postgresql://")) {
                dbUrl = "jdbc:" + dbUrl;
            } else if (dbUrl.startsWith("postgres://")) {
                dbUrl = "jdbc:postgresql://" + dbUrl.substring("postgres://".length());
            }

            System.setProperty("spring.datasource.url", dbUrl);
            System.setProperty("spring.datasource.driverClassName", "org.postgresql.Driver");
            System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.PostgreSQLDialect");
            System.out.println("--> Auto-configured PostgreSQL JDBC URL: " + dbUrl.replaceAll(":[^/@]+@", ":****@"));
        }

        SpringApplication.run(BackendApplication.class, args);
    }
}

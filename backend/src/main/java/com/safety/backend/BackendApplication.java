package com.safety.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.URI;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        sanitizeAndSetPostgresProperties();
        SpringApplication.run(BackendApplication.class, args);
    }

    private static void sanitizeAndSetPostgresProperties() {
        String dbUrl = System.getenv("SPRING_DATASOURCE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getProperty("spring.datasource.url");
        }

        if (dbUrl != null && !dbUrl.isBlank()) {
            try {
                String cleanUrl = dbUrl.trim();
                cleanUrl = cleanUrl.replace("&channel_binding=require", "").replace("?channel_binding=require", "");

                String uriStr = cleanUrl;
                if (uriStr.startsWith("jdbc:postgresql://")) {
                    uriStr = uriStr.substring("jdbc:".length());
                } else if (uriStr.startsWith("jdbc:postgres://")) {
                    uriStr = uriStr.substring("jdbc:".length());
                }

                if (!uriStr.startsWith("postgres://") && !uriStr.startsWith("postgresql://")) {
                    uriStr = "postgresql://" + uriStr;
                }

                URI uri = new URI(uriStr);
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath() != null && !uri.getPath().isEmpty() ? uri.getPath() : "/neondb";
                String userInfo = uri.getUserInfo();
                String query = uri.getQuery();

                if (host != null) {
                    StringBuilder jdbcUrl = new StringBuilder();
                    jdbcUrl.append("jdbc:postgresql://").append(host).append(":").append(port).append(path);
                    if (query != null && !query.isEmpty()) {
                        jdbcUrl.append("?").append(query);
                    } else {
                        jdbcUrl.append("?sslmode=require");
                    }

                    System.setProperty("spring.datasource.url", jdbcUrl.toString());
                    System.setProperty("spring.datasource.driverClassName", "org.postgresql.Driver");
                    System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.PostgreSQLDialect");

                    if (userInfo != null && userInfo.contains(":")) {
                        String[] userPass = userInfo.split(":", 2);
                        System.setProperty("spring.datasource.username", userPass[0]);
                        System.setProperty("spring.datasource.password", userPass[1]);
                    }

                    System.out.println("--> Successfully auto-configured PostgreSQL JDBC URL: " + jdbcUrl.toString());
                    if (userInfo != null) {
                        System.out.println("--> Extracted database user: " + userInfo.split(":")[0]);
                    }
                }
            } catch (Exception e) {
                System.err.println("WARN: Could not parse custom postgres URL format: " + e.getMessage());
            }
        }
    }
}

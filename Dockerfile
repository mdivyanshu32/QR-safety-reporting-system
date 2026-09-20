# Multi-stage Dockerfile for Spring Boot Backend on Render / Cloud Hosting
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY backend/ .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENV PORT=8080

ENTRYPOINT ["java", "-jar", "app.jar"]

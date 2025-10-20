# Build the application with Maven
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# Create a slim, runnable image with just the JRE
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR file from the 'build' stage
COPY --from=build /app/target/backend-java-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 8081

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
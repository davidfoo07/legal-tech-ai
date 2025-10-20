# ---  Build the application ---
FROM eclipse-temurin:17-jdk-jammy AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the entire backend source code into the container
COPY . .

# Run the Maven command to build the executable .jar file
RUN ./mvnw clean package -DskipTests

# --- ADD THESE TWO LINES FOR DEBUGGING ---
RUN apt-get update && apt-get install -y unzip
RUN echo "--- CHECKING LIBS ---" && unzip -l /app/target/*.jar | grep postgresql
# --- END DEBUGGING LINES ---

# Create the final, smaller image ---
FROM eclipse-temurin:17-jre-jammy

# Set the working directory
WORKDIR /app

# Copy the .jar file we created in the 'builder' stage into this final image
COPY --from=builder /app/target/*.jar app.jar

# Tell the container to listen on port 8081
EXPOSE 8081

# The command to run when the container starts
CMD ["java", "-jar", "app.jar"]
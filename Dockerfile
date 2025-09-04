# Use a modern, official Java base image
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and project definition files
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Copy the rest of the application source code
COPY src ./src

# Build the application using the Maven wrapper.
# -DskipTests skips running tests during the build to speed it up.
RUN ./mvnw package -DskipTests

# Expose the port the application runs on
EXPOSE 8080

# Define the command to run the application
# This will execute the .jar file created in the 'package' step
ENTRYPOINT ["java", "-jar", "target/user-service-0.0.1-SNAPSHOT.jar"]
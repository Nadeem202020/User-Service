package com.assessment.user_service.config;

import com.assessment.user_service.model.User;
import com.assessment.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if the database is empty
        if (userRepository.count() == 0) {
            log.info("No users found in the database. Creating a default admin user.");
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setAge(99);

            userRepository.save(admin);

            log.info("Default admin user created with email: admin@example.com");
        } else {
            log.info("Database already contains users. Skipping admin user creation.");
        }
    }
}

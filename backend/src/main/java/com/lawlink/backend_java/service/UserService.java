package com.lawlink.backend_java.service;

import com.lawlink.backend_java.dto.User.LoginRequest;
import com.lawlink.backend_java.dto.User.LoginResponse;
import com.lawlink.backend_java.entity.User;
import com.lawlink.backend_java.exception.EmailAlreadyExistsException;
import com.lawlink.backend_java.exception.EmailDoesNotExistException;
import com.lawlink.backend_java.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createNewUser(User user) {
        Optional<User> userOptional = userRepository.findUserByEmail(user.getEmail());

        if (userOptional.isPresent()) {
            throw new EmailAlreadyExistsException("User with email " + user.getEmail() + " already exists");
        }

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest loginRequest) {
        User existingUser = userRepository.findUserByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new EmailDoesNotExistException("User with email "
                                                                    + loginRequest.getEmail() + " does not exist"));

        return new LoginResponse(existingUser.getUid(), existingUser.getUsername(), existingUser.getEmail(), existingUser.getRole(), existingUser.getLanguage());
    }

    public LoginResponse login_as_guest() {
        User newUser = new User();
        newUser.setUsername("Guest");
        newUser.setEmail("guest@gmail.com");
        newUser.setPhone("+9596110670");
        newUser.setLanguage("en");

        userRepository.save(newUser);

        return new LoginResponse(newUser.getUid(), newUser.getUsername(), newUser.getEmail(), newUser.getRole(), newUser.getLanguage());
    }
}

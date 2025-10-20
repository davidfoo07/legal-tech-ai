package com.lawlink.backend_java.service;

import com.lawlink.backend_java.dto.LoginRequest;
import com.lawlink.backend_java.dto.LoginResponse;
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

        return new LoginResponse(existingUser.getUid(), existingUser.getUsername(), existingUser.getEmail(), existingUser.getRole());
    }
}

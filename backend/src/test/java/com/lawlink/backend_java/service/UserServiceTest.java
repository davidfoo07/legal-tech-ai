package com.lawlink.backend_java.service;

import com.lawlink.backend_java.dto.User.LoginRequest;
import com.lawlink.backend_java.dto.User.LoginResponse;
import com.lawlink.backend_java.entity.User;
import com.lawlink.backend_java.enums.Role;
import com.lawlink.backend_java.exception.EmailAlreadyExistsException;
import com.lawlink.backend_java.exception.EmailDoesNotExistException;
import com.lawlink.backend_java.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    private User createMockUser(String email, Role role) {
        User user = new User();
        user.setEmail(email);
        user.setRole(role);
        user.setUsername("Test 1");
        user.setPhone("12345678");
        user.setLanguage("en");
        return user;
    }

    @Test
    void createNewUser_shouldSaveUser_whenEmailIsUnique() {
        // Arrange
        User newUser = createMockUser("test1@gmail.com", Role.USER);
        User savedUser = createMockUser("test1@gmail.com", Role.USER);

        when(userRepository.findUserByEmail(newUser.getEmail())).thenReturn(Optional.empty());

        when(userRepository.save(newUser)).thenReturn(savedUser);

        // Act
        User result = userService.createNewUser(newUser);

        // Assert
        assertNotNull(result);
        assertEquals(savedUser.getEmail(), result.getEmail());

        verify(userRepository, times(1)).findUserByEmail(newUser.getEmail());
        verify(userRepository, times(1)).save(newUser);
    }

    @Test
    void createNewUser_shouldThrowEmailAlreadyExistsException_whenEmailIsAlreadyExists() {
        String existingEmail = "test1@gmail.com";
        User newUser = createMockUser(existingEmail, Role.USER);
        User existingUser = createMockUser(existingEmail, Role.USER);

        when(userRepository.findUserByEmail(existingEmail)).thenReturn(Optional.of(existingUser));

        assertThrows(EmailAlreadyExistsException.class, () -> {
            userService.createNewUser(newUser);
        });

        verify(userRepository, times(1)).findUserByEmail(existingEmail);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_shouldLoginUser_whenEmailIsRegistered() {
        String email = "test1@gmail.com";
        User existingUser = createMockUser(email, Role.USER);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);

        when(userRepository.findUserByEmail(email)).thenReturn(Optional.of(existingUser));

        LoginResponse result = userService.login(loginRequest);

        assertNotNull(result);
        assertEquals(existingUser.getEmail(), result.getEmail());
        assertEquals(existingUser.getRole(), result.getRole());

        verify(userRepository, times(1)).findUserByEmail(email);
    }

    @Test
    void login_shouldThrowEmailDoesExistException_whenEmailDoesNotExist() {
        String email = "test1@gmail.com";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);

        when(userRepository.findUserByEmail(email)).thenReturn(Optional.empty());

        assertThrows(EmailDoesNotExistException.class, () -> {
            userService.login(loginRequest);
        });

        verify(userRepository, times(1)).findUserByEmail(email);
    }



}
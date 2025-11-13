package com.lawlink.backend_java.controller;

import com.lawlink.backend_java.entity.User;
import com.lawlink.backend_java.repository.UserRepository;
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import io.restassured.http.ContentType;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserLoginApiTest {
    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        userRepository.deleteAll();
    }

//    @Test
//    void createNewUser_shouldReturn200AndValidUserResponse_onSuccess() {
//        User newUser = new User();
//        newUser.setEmail("test1@gmail.com");
//        newUser.setUsername("test1");
//
//        given()
//                .contentType(ContentType.JSON)
//                .body(newUser)
//        .when()
//                .post("/api/v1/auth/register")
//        .then()
//                .statusCode(200)
//                .body("email", equalTo("test1@gmail.com"))
//                .body("username",  equalTo("test1"))
//                .body("uid", notNullValue());
//    }

}
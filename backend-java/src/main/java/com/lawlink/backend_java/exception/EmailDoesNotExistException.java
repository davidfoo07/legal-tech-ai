package com.lawlink.backend_java.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED, reason = "Email does not exist")
public class EmailDoesNotExistException extends RuntimeException {
  public EmailDoesNotExistException(String message) {
    super(message);
  }
}

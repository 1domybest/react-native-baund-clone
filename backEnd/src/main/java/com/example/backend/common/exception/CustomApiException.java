package com.example.backend.common.exception;


import lombok.Data;
import org.springframework.http.HttpStatus;


@Data
public class CustomApiException extends RuntimeException{

    private static final long serialVersionUID = 1L;

    public String message;

    public HttpStatus httpStatus;

    public CustomApiException(String message, HttpStatus httpStatus) {
        super(message);
        this.message = message;
        this.httpStatus = httpStatus;
    }
}

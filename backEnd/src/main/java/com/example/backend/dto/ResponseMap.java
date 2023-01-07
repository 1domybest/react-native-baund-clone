package com.example.backend.dto;

import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Data
public class ResponseMap {

    private String message;

    private HttpStatus httpStatus;

    private ResponseEntity data;
}

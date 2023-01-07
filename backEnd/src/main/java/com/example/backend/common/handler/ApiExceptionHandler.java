package com.example.backend.common.handler;

import com.example.backend.common.exception.CustomApiException;
import com.example.backend.dto.CMRespDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;

@ControllerAdvice
@RequiredArgsConstructor
public class ApiExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(ApiExceptionHandler.class);
    @ExceptionHandler(CustomApiException.class)
    public ResponseEntity<?> customApiException(CustomApiException e, HttpServletRequest request) {
        if (e.httpStatus.value() != 200) {
            logger.error("Request: {} {})", request.getMethod(), request.getRequestURL());
        }
        return new ResponseEntity<>(
                new CMRespDto<>(
                        e.httpStatus.value(),
                        e.message,
                        null),
                e.httpStatus);
    }
}

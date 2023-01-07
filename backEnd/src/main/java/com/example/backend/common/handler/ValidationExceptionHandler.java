package com.example.backend.common.handler;

import com.example.backend.common.aop.LogAdvice;
import com.example.backend.dto.CMRespDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import javax.servlet.http.HttpServletRequest;

@ControllerAdvice
@RequiredArgsConstructor
public class ValidationExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(LogAdvice.class);
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validationApiException(MethodArgumentNotValidException e, HttpServletRequest request) {
        logger.error("Request: {} {})", request.getMethod(), request.getRequestURL());
        return new ResponseEntity<>(
                new CMRespDto<>(
                        HttpStatus.BAD_REQUEST.value(),
                        e.getBindingResult().getAllErrors().get(0).getDefaultMessage(),
                        null),
                HttpStatus.BAD_REQUEST);
    }

}

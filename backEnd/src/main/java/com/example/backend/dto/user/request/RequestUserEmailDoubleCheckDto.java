package com.example.backend.dto.user.request;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class RequestUserEmailDoubleCheckDto {

    @NotBlank(message = "이메일을 입력해주세요")
    @Email(message = "정확한 이메일을 입력해주세요")
    private String email;
}

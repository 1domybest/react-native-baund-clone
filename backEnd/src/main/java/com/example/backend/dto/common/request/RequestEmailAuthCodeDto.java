package com.example.backend.dto.common.request;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

@Data
public class RequestEmailAuthCodeDto {

    @NotNull(message = "이메일을 입력해주세요")
    @Email(message = "맞지않는 이메일 형식입니다.")
    private String to;

}

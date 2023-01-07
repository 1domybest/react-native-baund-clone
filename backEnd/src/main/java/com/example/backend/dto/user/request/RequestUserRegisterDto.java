package com.example.backend.dto.user.request;

import com.example.backend.domain.User;
import lombok.Data;
import org.springframework.lang.Nullable;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
public class RequestUserRegisterDto {

    @NotBlank(message = "이름을 입력해주세요")
    private String userName; // 이름

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "정확한 이메일을 입력해주세요")
    private String email; // 이메일

    @Nullable
    private String provider; // 로그인한 sns 브랜드명 예) google

    @Nullable
    private String providerId; // 로그인한 sns의 회원 고유번호 예)asdAKSDJjwndjicIAI2314

    @Nullable
    private String phone;

    public User toEntity () {
        return User.builder()
                .userName(userName)
                .email(email)
                .provider(provider)
                .providerId(providerId)
                .phone(phone)
                .build();
    }
}

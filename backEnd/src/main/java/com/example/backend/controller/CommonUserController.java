package com.example.backend.controller;

import com.example.backend.dto.CMRespDto;
import com.example.backend.dto.DataMap;
import com.example.backend.dto.ResponseMap;
import com.example.backend.dto.common.request.RequestEmailAuthCodeDto;
import com.example.backend.dto.common.response.ResponseEmailAuthCodeDto;
import com.example.backend.dto.user.request.RequestUserEmailDoubleCheckDto;
import com.example.backend.dto.user.request.RequestUserRegisterDto;
import com.example.backend.service.CommonService;
import com.example.backend.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"*"})
@RequestMapping("/api/common/user")
public class CommonUserController {

    private final UserService userService;
    private final CommonService commonService;

    /**
     * 일반 회원가입
     * @param requestUserRegisterDto
     * @return
     */
    @PostMapping("/register")
    public CMRespDto<?> register (@Valid @RequestBody RequestUserRegisterDto requestUserRegisterDto, HttpServletRequest request, HttpServletResponse response) {
        return new CMRespDto<>(200, "회원가입이 완료되었습니다.", userService.register(requestUserRegisterDto, request, response));
    }

    /**
     * 아이디 중복체크
     * @param requestUserRegisterDto
     * @return
     */
    @PostMapping("/userEmailDoubleCheck")
    public CMRespDto<?> userEmailDoubleCheck (@Valid @RequestBody RequestUserEmailDoubleCheckDto requestUserRegisterDto) {
        return new CMRespDto<>(200, "사용 가능한 이메일 입니다.", userService.userEmailDoubleCheck(requestUserRegisterDto));
    }

    /**
     * 소셜 로그인
     * @param requestUserRegisterDto
     * @return
     */
    @PostMapping("/snsLogin")
    public CMRespDto<?> snsLogin (@Valid @RequestBody RequestUserRegisterDto requestUserRegisterDto, HttpServletRequest request, HttpServletResponse response) {
        ResponseMap responseMap = userService.snsLogin(requestUserRegisterDto, request, response);
        return new CMRespDto<>(responseMap.getHttpStatus().value(), responseMap.getMessage(), null);
    }

    /**
     * 소셜 로그인 연동
     * @param requestUserRegisterDto
     * @return
     */
    @PostMapping("/updateProvider")
    public CMRespDto<?> updateProvider (@Valid @RequestBody RequestUserRegisterDto requestUserRegisterDto) {
        ResponseMap responseMap = userService.updateProvider(requestUserRegisterDto);
        return new CMRespDto<>(responseMap.getHttpStatus().value(), responseMap.getMessage(), null);
    }

    /**
     * 소셜 로그인 연동
     * @param requestEmailAuthCodeDto
     * @return
     */
    @PostMapping("/sendEmailAuthCode")
    public CMRespDto<?> sendEmailAuthCode (@Valid @RequestBody RequestEmailAuthCodeDto requestEmailAuthCodeDto) {
        ResponseMap responseMap = commonService.sendSimpleMessage(requestEmailAuthCodeDto);
        return new CMRespDto<>(responseMap.getHttpStatus().value(), responseMap.getMessage(), responseMap.getData().getBody());
    }

    /**
     * 소셜 로그인 연동
     * @param requestEmailAuthCodeDto
     * @return
     */
    @PostMapping("/temporaryPassword")
    public CMRespDto<?> temporaryPassword (@Valid @RequestBody RequestEmailAuthCodeDto requestEmailAuthCodeDto) {
        ResponseMap responseMap = commonService.temporaryPassword(requestEmailAuthCodeDto);
        return new CMRespDto<>(responseMap.getHttpStatus().value(), responseMap.getMessage(), responseMap.getData().getBody());
    }
}

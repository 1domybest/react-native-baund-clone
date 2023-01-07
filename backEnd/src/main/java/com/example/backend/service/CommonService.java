package com.example.backend.service;

import com.example.backend.common.exception.CustomApiException;
import com.example.backend.dto.ResponseMap;
import com.example.backend.dto.common.request.RequestEmailAuthCodeDto;
import com.example.backend.dto.common.response.ResponseEmailAuthCodeDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class CommonService {
    private final JavaMailSender emailSender;


    public static String getRandomString() {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 10;
        Random random = new Random();
        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
        return generatedString;
    }
    public ResponseMap sendSimpleMessage(RequestEmailAuthCodeDto requestEmailAuthCodeDto) {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        int emailAuthCode = (int) (Math.random() * 100000);
        System.out.println(emailAuthCode);
        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(requestEmailAuthCodeDto.getTo()); // 메일 수신자
            mimeMessageHelper.setSubject("보안인증"); // 메일 제목
            mimeMessageHelper.setText("<html><head></head><body><h1>보안 인증 번호입니다.</h1><h3>[ "+ emailAuthCode +" ]</h3></body></html>", true); // 메일 본문 내용, HTML 여부
            emailSender.send(mimeMessage);

            ResponseEmailAuthCodeDto responseEmailAuthCodeDto = new ResponseEmailAuthCodeDto();
            responseEmailAuthCodeDto.setEmailAuthCode(String.valueOf(emailAuthCode));
            ResponseMap responseMap = new ResponseMap();
            responseMap.setHttpStatus(HttpStatus.OK);
            responseMap.setMessage("인증번호가 전송되었습니다.");
            responseMap.setData(new ResponseEntity<>(responseEmailAuthCodeDto, null, HttpStatus.OK));
            return responseMap;
        } catch (MessagingException e) {
            throw new CustomApiException("인증번호 전송에 실패하였습니다.\n잠시후 다시시도해주세요", HttpStatus.BAD_REQUEST);
        }
    }

    public ResponseMap temporaryPassword(RequestEmailAuthCodeDto requestEmailAuthCodeDto) {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        String getRandomString = getRandomString();
        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(requestEmailAuthCodeDto.getTo()); // 메일 수신자
            mimeMessageHelper.setSubject("보안인증"); // 메일 제목
            mimeMessageHelper.setText("<html><head></head><body><h1>보안 인증 번호입니다.</h1><h3>[ "+ getRandomString +" ]</h3></body></html>", true); // 메일 본문 내용, HTML 여부
            emailSender.send(mimeMessage);

            ResponseEmailAuthCodeDto responseEmailAuthCodeDto = new ResponseEmailAuthCodeDto();
            responseEmailAuthCodeDto.setEmailAuthCode(getRandomString);
            ResponseMap responseMap = new ResponseMap();
            responseMap.setHttpStatus(HttpStatus.BAD_REQUEST);
            responseMap.setMessage("임시 비밀번호가 발급되었습니다.");
            responseMap.setData(new ResponseEntity<>(responseEmailAuthCodeDto, null, HttpStatus.BAD_REQUEST));
            return responseMap;
        } catch (MessagingException e) {
            throw new CustomApiException("임시비밀번호 발급에 실패하였습니다.\n잠시후 다시시도해주세요", HttpStatus.BAD_REQUEST);
        }
    }
}

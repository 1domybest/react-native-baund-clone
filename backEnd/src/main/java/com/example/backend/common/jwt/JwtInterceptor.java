package com.example.backend.common.jwt;

import com.example.backend.common.exception.CustomApiException;
import com.example.backend.domain.User;
import com.example.backend.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
@RequiredArgsConstructor
public class JwtInterceptor implements HandlerInterceptor {

    private static final String ACCESS_TOKEN = "accessToken";
    private static final String REFRESH_TOKEN = "refreshToken";

    private static final int TEN_MINUTE = 1000 * 60 * 10;

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        final String accessToken = request.getHeader(ACCESS_TOKEN);
        final String refreshToken = request.getHeader(REFRESH_TOKEN);

        if (!accessToken.isEmpty() && jwtService.isUsable(accessToken)) { // accessToken 가 존재하고 사용이 가능하다면 로그인이 되있는 상태
            if (jwtService.isExpire(accessToken)) { // 토큰이 유효한지 확인
                if (!refreshToken.isEmpty()) { // 리프레쉬 토큰이 존재한다면
                    if (!jwtService.isExpire(refreshToken)) { // 리프레쉬 토큰이 아직 유효하다면
                        User user = userRepository.findByRefreshToken(refreshToken);
                        if (user != null) {
                            JWTUserMap jwtUserMap = new JWTUserMap(user);
                            String newAccessToken = jwtService.createAccessToken(user.getNo()+"", TEN_MINUTE, jwtUserMap.getJWTMap());
                            response.setHeader(ACCESS_TOKEN, newAccessToken);
                            return true;
                        } else {
                            throw new CustomApiException("존재하지 않는 계정입니다.", HttpStatus.BAD_REQUEST);
                        }
                    } else {
                        throw new CustomApiException("로그인 세션이 만료되었습니다 다시로그인해주세요.", HttpStatus.BAD_REQUEST);
                    }
                } else {
                    throw new CustomApiException("로그인 세션이 만료되었습니다 다시로그인해주세요.", HttpStatus.BAD_REQUEST);
                }
            }

            if (jwtService.isExpire(refreshToken)) {
                throw new CustomApiException("로그인 세션이 만료되었습니다 다시로그인해주세요.", HttpStatus.BAD_REQUEST);
            }
            return true;
        } else { // accessToken 존재하지 않음 == 로그아웃
            throw new CustomApiException("로그인이 필요한 서비스입니다..", HttpStatus.BAD_REQUEST);
        }

    }
}

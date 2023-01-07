package com.example.backend.service;

import com.example.backend.common.exception.CustomApiException;
import com.example.backend.common.jwt.JWTUserMap;
import com.example.backend.common.jwt.JwtService;
import com.example.backend.domain.User;
import com.example.backend.dto.DataMap;
import com.example.backend.dto.ResponseMap;
import com.example.backend.dto.user.request.RequestUserEmailDoubleCheckDto;
import com.example.backend.dto.user.request.RequestUserRegisterDto;
import com.example.backend.repository.user.UserRepository;
import com.example.backend.repository.user.UserRepositorySupport;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JwtService jwtService;
    private static final String ACCESS_TOKEN = "accessToken";
    private static final String REFRESH_TOKEN = "refreshToken";
    private static final int TEN_MINUTE = 1000 * 60 * 10;

    private static final int DAY = 1000 * 60 * 10 * 60 * 24;
    private final UserRepository userRepository;
    private final UserRepositorySupport userRepositorySupport;


    public void initToken (User user, HttpServletRequest request, HttpServletResponse response) {
        // 엑세스 토큰 생성 (유효시간은 최대한 짧게)
        System.out.println(user.getUserName());
        JWTUserMap jwtUserMap = new JWTUserMap(user);
        String accessToken = jwtService.createAccessToken(user.getNo()+"", TEN_MINUTE, jwtUserMap.getJWTMap());
        response.setHeader(ACCESS_TOKEN, accessToken); // 헤더에 넣어준다

        //리프레쉬 토큰 생성 (유효기간은 최대한 길게)
        String refreshToken  = jwtService.createRefreshToken(DAY); // 리프레쉬 토큰은 아무런 정보가없는 입장권
        user.setRefreshToken(refreshToken); // 리프레쉬 토큰은 db에 저장해야함
        response.setHeader(REFRESH_TOKEN, refreshToken); // 헤더에 넣어준다
    }

    /**
     * 일반 회원가입
     * @param requestUserRegisterDto
     * @return
     */
    @Transactional(readOnly = false)
    public boolean register (RequestUserRegisterDto requestUserRegisterDto, HttpServletRequest request, HttpServletResponse response) {
        User user = userRepository.save(requestUserRegisterDto.toEntity());
        initToken(user, request, response); // 토큰 생성 함수
        if (user != null) {
            return true;
        } else {
            throw new CustomApiException("회원가입에 실패하였습니다.\n고객 센터에 문의해주세요.", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 아이디 중복체크
     * @param requestUserRegisterDto
     * @return
     */
    @Transactional(readOnly = true)
    public Boolean userEmailDoubleCheck (RequestUserEmailDoubleCheckDto requestUserRegisterDto) {
        User user = userRepositorySupport.findByEmail(requestUserRegisterDto.getEmail());
        if (user != null) {
            throw new CustomApiException("이미 사용중인 아이디 입니다.", HttpStatus.BAD_REQUEST);
        } else {
            return true;
        }
    }

    /**
     * 소셜 로그인
     * @param requestUserRegisterDto
     * @return
     */
    @Transactional(readOnly = false) // 로그인뿐만 아니라 회원가입일수도 있기때문 false
    public ResponseMap snsLogin (RequestUserRegisterDto requestUserRegisterDto, HttpServletRequest request, HttpServletResponse response) {
        ResponseMap responseMap = new ResponseMap();
        User user = userRepositorySupport.findByEmail(requestUserRegisterDto.getEmail());
        if (user == null) { // 같은 이메일로 가입한 회원이 없다면 (= sns로 첫 로그인 이라는 뜻)
            user = userRepository.save(requestUserRegisterDto.toEntity()); // 가입 진행
            responseMap.setHttpStatus(HttpStatus.OK);
            responseMap.setMessage("회원가입이 완료되었습니다");
            initToken(user, request, response); // 토큰 생성 함수
            return responseMap;
        } else {
            if (user.getProvider() == null) { // sns 로 가입한 이력이 x
                throw new CustomApiException("일반 이메일회원입니다.\n연동하시겠습니까?.", HttpStatus.SEE_OTHER); // 일반회원으로 가입한 경로가 존재함
            } else {
                user.setProvider(requestUserRegisterDto.getProvider()); // sns의 가입경로를 바꿔준다
                user.setProviderId(requestUserRegisterDto.getProviderId()); // sns의 고유 번호를 바꿔준다.
                initToken(user, request, response); // 토큰 생성 함수
                responseMap.setHttpStatus(HttpStatus.OK);
                responseMap.setMessage("로그인 완료");
                return responseMap;

            }
        }
    }

    /**
     * 소셜 로그인 연동
     * @param requestUserRegisterDto
     * @return
     */
    @Transactional(readOnly = false) // 로그인뿐만 아니라 회원가입일수도 있기때문 false
    public ResponseMap updateProvider (RequestUserRegisterDto requestUserRegisterDto) {
        User user = userRepositorySupport.findByEmail(requestUserRegisterDto.getEmail());
        user.setProvider(requestUserRegisterDto.getProvider());
        user.setProviderId(requestUserRegisterDto.getProviderId());
        ResponseMap responseMap = new ResponseMap();
        responseMap.setHttpStatus(HttpStatus.OK);
        responseMap.setMessage("연동되었습니다.");
        return responseMap;
    }

}

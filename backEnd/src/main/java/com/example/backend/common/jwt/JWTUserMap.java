package com.example.backend.common.jwt;

import com.example.backend.domain.User;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class JWTUserMap {

    private Long userNo;
    private String userName;
    private String nickName;
    private String role;
    private String phone;
    private int state;

    public JWTUserMap(User user) {
        this.userNo = user.getNo();
        this.userName = user.getUserName();
        this.role = user.getRole();
        this.phone = user.getPhone();
        this.state = user.getState();
        this.nickName = user.getNickName();
    }

    public Map<String, Object> getJWTMap () {
        Map<String, Object> map = new HashMap<>();
        map.put("userNo", this.userNo);
        map.put("userName", this.userName);
        map.put("nickName", this.nickName);
        map.put("phone", this.phone);
        map.put("role", this.role);
        map.put("state", this.state);
        return map;
    }
}

package com.example.backend.repository.user;

import com.example.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    public User findByRefreshToken(String refreshToken);
}

package com.taskmanagement.kotazk.service.impl;


import com.taskmanagement.kotazk.entity.RefreshToken;
import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;
import com.taskmanagement.kotazk.repository.IRefreshTokenRepository;
import com.taskmanagement.kotazk.repository.IUserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Optional;
import java.util.UUID;
@Service
public class RefreshTokenService {
    @Autowired
    private IRefreshTokenRepository refreshTokenRepository;

    @Autowired
    private IUserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken createRefreshToken(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .expiryDate(new Timestamp(System.currentTimeMillis() + 14L * 24L * 60L * 60L * 1000L))
                .token(UUID.randomUUID().toString())
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(new Timestamp(System.currentTimeMillis())) < 0) {
            refreshTokenRepository.delete(token);
            throw new CustomException("Refresh token expired");
        }
        return token;
    }

    @Transactional
    public int deleteByUserId(Long userId) {
        User existUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return refreshTokenRepository.deleteByUser(existUser);
    }
}

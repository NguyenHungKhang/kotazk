package com.taskmanagement.kotazk.util;

import java.security.SecureRandom;

public class RandomStringGeneratorUtil {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int TOKEN_LENGTH = 6;
    private static final int TOKEN_LENGTH_KEY = 8;
    private static final SecureRandom RANDOM = new SecureRandom();

    public static String generateToken() {
        StringBuilder token = new StringBuilder(TOKEN_LENGTH);
        for (int i = 0; i < TOKEN_LENGTH; i++) {
            token.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return token.toString();
    }

    public static String generateKey() {
        StringBuilder token = new StringBuilder(TOKEN_LENGTH_KEY);
        for (int i = 0; i < TOKEN_LENGTH_KEY; i++) {
            token.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return token.toString();
    }
}

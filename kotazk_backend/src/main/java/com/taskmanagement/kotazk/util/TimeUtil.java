package com.taskmanagement.kotazk.util;

import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

@Service
public class TimeUtil {

    public Timestamp getCurrentUTCTimestamp() {
        // Get the current time in UTC
        Instant now = Instant.now();

        // Convert Instant to Timestamp
        return Timestamp.from(now);
    }
}

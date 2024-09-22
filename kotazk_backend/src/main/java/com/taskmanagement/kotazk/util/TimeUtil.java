package com.taskmanagement.kotazk.util;

import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
public class TimeUtil {

    public Timestamp getCurrentUTCTimestamp() {
        // Get the current time in UTC
        Instant now = Instant.now();

        // Convert Instant to Timestamp
        return Timestamp.from(now);
    }

    public static Timestamp convertSpecificStringToTimestamp(String str) {
        if (str == null) return null;
        else if (str.equals("none")) return null;
        try {
            OffsetDateTime offsetDateTime = OffsetDateTime.parse(str, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
            return Timestamp.valueOf(offsetDateTime.toLocalDateTime());
        } catch (DateTimeParseException e) {
            System.out.println("Error parsing date: " + e.getMessage());
            return null;
        }
    }
}

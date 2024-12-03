package com.taskmanagement.kotazk.util;

import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class TimeUtil {

    public Timestamp getCurrentUTCTimestamp() {
        Instant now = Instant.now();
        return Timestamp.from(now);
    }

    public List<Timestamp> get24HCurrentUTCTimestamp() {
        long currentMillis = System.currentTimeMillis();
        long startOfDayMillis = currentMillis - (currentMillis % (24 * 60 * 60 * 1000));
        long endOfDayMillis = startOfDayMillis + (24 * 60 * 60 * 1000) - 1;
        Instant startOfDay = Instant.ofEpochMilli(startOfDayMillis);
        Instant endOfDay = Instant.ofEpochMilli(endOfDayMillis);
        Timestamp startTimestamp = Timestamp.from(startOfDay);
        Timestamp endTimestamp = Timestamp.from(endOfDay);

        List<Timestamp> timestamps = new ArrayList<>();
        timestamps.add(startTimestamp);
        timestamps.add(endTimestamp);

        return timestamps;
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

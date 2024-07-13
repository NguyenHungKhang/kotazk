package com.taskmanagement.kotazk.util;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.Timestamp;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class TimeUtil {

    @Value("${time.api.url}")
    private String timeApiUrl;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public Timestamp getCurrentUTCTimestamp() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(timeApiUrl))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            JSONObject jsonObject = new JSONObject(response.body());
            String dateTimeString = jsonObject.getString("utc_datetime");
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            OffsetDateTime offsetDateTime = OffsetDateTime.parse(dateTimeString, formatter);
            return Timestamp.from(offsetDateTime.toInstant());
        } else {
            throw new IOException("Failed to fetch time from API: " + response.statusCode());
        }
    }
}

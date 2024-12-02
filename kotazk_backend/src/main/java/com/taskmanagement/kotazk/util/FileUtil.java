package com.taskmanagement.kotazk.util;


import com.cloudinary.Cloudinary;
import com.cloudinary.api.ApiResponse;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Service
public class FileUtil {
    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private Cloudinary cloudinary;

    private static final Map<String, String> FILE_EXTENSION_MAP;

    static {
        FILE_EXTENSION_MAP = new HashMap<>();
        FILE_EXTENSION_MAP.put("image/jpeg", "jpg");
        FILE_EXTENSION_MAP.put("image/png", "png");
        FILE_EXTENSION_MAP.put("image/gif", "gif");
        FILE_EXTENSION_MAP.put("video/mp4", "mp4");
        FILE_EXTENSION_MAP.put("application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx");
        FILE_EXTENSION_MAP.put("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx");
        FILE_EXTENSION_MAP.put("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx");
        FILE_EXTENSION_MAP.put("text/plain", "txt");
        FILE_EXTENSION_MAP.put("application/msword", "doc");
        FILE_EXTENSION_MAP.put("application/vnd.ms-excel", "xls");
        FILE_EXTENSION_MAP.put("application/vnd.ms-powerpoint", "ppt");
        FILE_EXTENSION_MAP.put("application/pdf", "pdf");
    }

    public FileUtil() {
        cloudinary = new Cloudinary(ObjectUtils.asMap("cloud_name", "dhyms4uqh", "api_key", "611588351123625",
                "api_secret", "ahlGNR2MGTZCV1bafTP99VID5J4"));
    }

    public String determineFileType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType != null && FILE_EXTENSION_MAP.containsKey(contentType)) {
            return FILE_EXTENSION_MAP.get(contentType);
        }
        return null;
    }

    public boolean isValidFileType(MultipartFile file) {
        return determineFileType(file) != null;
    }

    public String uploadFile(MultipartFile file, String file_name) throws IOException {
        try {
            if (!isValidFileType(file)) {
                throw new IllegalArgumentException("Unsupported file type");
            }
            String filename = file_name + "." + determineFileType(file);
            Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("public_id", filename, "resource_type", "raw"));
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Error uploading file: " + e.getMessage());
        }
    }

    public void deleteFile(String url) throws IOException {
        try {
            ApiResponse apiResponse = cloudinary.api().deleteResources(Arrays.asList(getPublicId(url)),
                    ObjectUtils.asMap("type", "upload", "resource_type", "raw"));
            System.out.println(apiResponse);
        } catch (IOException exception) {
            System.out.println(exception.getMessage());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    public String getPublicId(String secureUrl) {
        if (secureUrl != null && secureUrl.startsWith("https://res.cloudinary.com/")) {
            String[] parts = secureUrl.split("/");
            return parts[parts.length - 1];
        }
        return null;
    }
}
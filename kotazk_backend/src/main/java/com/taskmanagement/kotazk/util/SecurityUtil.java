package com.taskmanagement.kotazk.util;

import com.taskmanagement.kotazk.entity.User;
import com.taskmanagement.kotazk.entity.enums.UserActiveStatus;
import com.taskmanagement.kotazk.exception.CustomException;
import com.taskmanagement.kotazk.exception.JwtException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.taskmanagement.kotazk.exception.ResourceNotFoundException;

public class SecurityUtil {

    // Lấy Authentication hiện tại
    public static Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    // Lấy tên người dùng hiện tại
    public static String getCurrentUsername() {
        Authentication authentication = getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new ResourceNotFoundException("User", "username", "unknown");
        }
        return ((UserDetails) authentication.getPrincipal()).getUsername();
    }

    // Lấy UserDetails hiện tại
    public static UserDetails getCurrentUserDetails() {
        Authentication authentication = getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new ResourceNotFoundException("User", "details", "unknown");
        }
        return (UserDetails) authentication.getPrincipal();
    }

    // Lấy ID người dùng hiện tại
    public static Long getCurrentUserId() {
        Authentication authentication = getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new ResourceNotFoundException("User", "ID", "unknown");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        if (userDetails instanceof User) { // Giả sử User là lớp chứa ID người dùng
            return ((User) userDetails).getId(); // getId() là phương thức tùy chỉnh trong User
        } else {
            throw new ResourceNotFoundException("User", "ID", "unknown");
        }
    }

    // Lấy User hiện tại
    public static User getCurrentUser() {
        Authentication authentication = getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User currentUser)) {
            throw new ResourceNotFoundException("User", "ID", "unknown");
        }

        if(!currentUser.getAccountStatus().equals(UserActiveStatus.ACTIVE))
            throw new JwtException("User have not activated yet!");

        return currentUser;
    }

    // Kiểm tra người dùng có một quyền cụ thể hay không
    public static boolean hasAuthority(String authority) {
        Authentication authentication = getAuthentication();
        if (authentication != null) {
            return authentication.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(authority));
        }
        return false;
    }
}
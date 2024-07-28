package com.taskmanagement.kotazk.security;

import com.taskmanagement.kotazk.exception.JwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private JwtToken jwtToken;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String requestToken = request.getHeader("Authorization");
        String username = null;
        String token = null;

        if (requestToken != null && requestToken.startsWith("Bearer ")) {
            token = requestToken.substring(7);
            try {
                username = this.jwtToken.getUsernameFromToken(token);
            } catch (IllegalArgumentException ex) {
                throw new JwtException("Unable to get JWT Token", ex);
            } catch (ExpiredJwtException ex) {
                throw new JwtException("JWT Token has expired", ex);
            } catch (MalformedJwtException ex) {
                throw new JwtException("Invalid JWT Token", ex);
            }
        } else {
            throw new JwtException("JWT Token is null or does not begin with Bearer");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.customUserDetailsService.loadUserByUsername(username);

            if (this.jwtToken.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            } else {
                throw new JwtException("Invalid JWT Token");
            }
        } else {
            throw new JwtException("Username is null or SecurityContextHolder is not null");
        }

        filterChain.doFilter(request, response);
    }

}

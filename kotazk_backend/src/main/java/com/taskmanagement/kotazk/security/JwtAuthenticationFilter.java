package com.taskmanagement.kotazk.security;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestToken = request.getHeader("Authorization");
        String username = null;
        String token = null;
        if (requestToken != null && requestToken.startsWith("Bearer")) {
            token = requestToken.substring(7); // after bearer fetch original token
            try {
                username = this.jwtToken.getUsernameFromToken(token);

            } catch (IllegalArgumentException ex) {
                System.out.println("Unable to get JWT Token");
            } catch (ExpiredJwtException ex) {
                System.out.println("JWT Token has expired");
            } catch (MalformedJwtException ex) {
                System.out.println("Invalid JWT: " + ex);
            }

        } else {
            System.out.println("JWT Token is null or doesnot begin with bearer");
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
                System.out.println("Invalid JWT Token");
            }

        } else {
            System.out.println("username is null or context is not null");
        }
        filterChain.doFilter(request, response);
    }

}

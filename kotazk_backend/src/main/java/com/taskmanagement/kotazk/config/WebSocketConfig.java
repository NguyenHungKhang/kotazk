//package com.taskmanagement.kotazk.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.socket.config.annotation.EnableWebSocket;
//import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
//import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
//import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;
//
//@Configuration
//@EnableWebSocket
//public class WebSocketConfig implements WebSocketConfigurer {
//
//    private final NotificationWebSocketHandler notificationWebSocketHandler;
//
//    // Constructor injection of NotificationWebSocketHandler
//    public WebSocketConfig(NotificationWebSocketHandler notificationWebSocketHandler) {
//        this.notificationWebSocketHandler = notificationWebSocketHandler;
//    }
//
//    @Override
//    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
//        registry.addHandler(notificationWebSocketHandler, "/ws/notifications")
//                .addInterceptors(new HttpSessionHandshakeInterceptor())
//                .setAllowedOrigins("*");  // Adjust CORS settings as needed
//    }
//}

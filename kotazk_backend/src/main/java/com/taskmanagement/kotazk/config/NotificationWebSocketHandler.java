//package com.taskmanagement.kotazk.config;
//
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//@Component
//public class NotificationWebSocketHandler extends TextWebSocketHandler {
//
//    private final SimpMessagingTemplate messagingTemplate;
//
//    public NotificationWebSocketHandler(SimpMessagingTemplate messagingTemplate) {
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    public void sendNotification(String message, String user) {
//        messagingTemplate.convertAndSendToUser(user, "/queue/notifications", message);
//    }
//}

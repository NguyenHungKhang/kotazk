package com.taskmanagement.kotazk.util;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SendEmailUtil {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(List<String> to, String subject, String body) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        // Convert List<String> to String[] as MimeMessageHelper requires an array
        helper.setTo(to.toArray(new String[0]));
        helper.setSubject(subject);
        helper.setText(body, true);

        javaMailSender.send(mimeMessage);
    }
}

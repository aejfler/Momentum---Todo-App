package com.smartbear.todoproject.services;

public interface EmailService {
    void sendNotification(String to, String subject, String body);
}

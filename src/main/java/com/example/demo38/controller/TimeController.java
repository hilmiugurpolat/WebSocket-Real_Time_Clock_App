package com.example.demo38.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;

import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
@EnableScheduling
public class TimeController {

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
    private String currentTime = dateFormat.format(new Date());

    private final SimpMessagingTemplate template;

    public TimeController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/time")
    @SendTo("/topic/time")
    public String getTime() {
        return currentTime;
    }

    @Scheduled(fixedRate = 1000)
    public void updateTime() {
        currentTime = dateFormat.format(new Date());
        template.convertAndSend("/topic/time", currentTime);
    }
}

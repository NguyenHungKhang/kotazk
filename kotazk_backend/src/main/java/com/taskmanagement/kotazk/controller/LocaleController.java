package com.taskmanagement.kotazk.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.LocaleResolver;

import java.util.Locale;

@RestController
public class LocaleController {

    @Autowired
    private LocaleResolver localeResolver;

    public LocaleController(LocaleResolver localeResolver) {
        this.localeResolver = localeResolver;
    }

    @GetMapping("/change-locale")
    public String changeLocale(HttpServletRequest request, HttpServletResponse response, @RequestParam("lang") String lang) {
        Locale locale = new Locale(lang);
        localeResolver.setLocale(request, response, locale);
        return "Locale changed to " + lang;
    }
}

package com.cognitiveapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 Arranca Spring Boot y por defecto el patrón MVC.
 */
@SpringBootApplication
public class ApplicationTraining {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationTraining.class, args);
    }
}

package com.example.pawbaku;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class PawBakuApplication {

    public static void main(String[] args) {
        SpringApplication.run(PawBakuApplication.class, args);
    }
}
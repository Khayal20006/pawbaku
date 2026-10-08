package com.example.pawbaku.config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Serves uploaded images from disk under the public {@code /uploads/**} path. */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final Path uploadsRoot;

    public WebConfig(@Value("${pawbaku.uploads.dir:uploads}") String directory) {
        this.uploadsRoot = Paths.get(directory).toAbsolutePath().normalize();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadsRoot.toUri().toString())
                .setCachePeriod(600);
    }
}
package com.example.pawbaku.controller;

import com.example.pawbaku.service.FileStorageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/** Authenticated image upload. Returns a public URL that can be stored as photoUrl. */
@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    public record UploadResponse(String url) {
    }

    private final FileStorageService fileStorageService;

    public UploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResponse upload(@RequestPart("file") MultipartFile file) {
        return new UploadResponse(fileStorageService.store(file));
    }
}
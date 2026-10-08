package com.example.pawbaku.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

import com.example.pawbaku.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Accepts image uploads and persists them under the configured uploads directory.
 * The returned relative URL is served by {@code /uploads/**} (nginx proxies it to the
 * backend, which serves the file from disk) and can be stored on entities as photoUrl.
 */
@Service
public class FileStorageService {

    /** Only these content types are accepted; filename extension is never trusted. */
    private static final Map<String, String> MIME_EXTENSIONS = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp");

    private static final long MAX_BYTES = 5L * 1024 * 1024;

    private final Path root;

    public FileStorageService(@Value("${pawbaku.uploads.dir:uploads}") String directory) {
        this.root = Paths.get(directory).toAbsolutePath().normalize();
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new IllegalStateException("Upload kataloqu yaradıla bilmədi: " + root, e);
        }
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Şəkil faylı seçilməyib");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new BadRequestException("Şəkil 5 MB-dan böyük ola bilməz");
        }
        String extension = MIME_EXTENSIONS.get(file.getContentType());
        if (extension == null) {
            throw new BadRequestException("Yalnız JPG, PNG və WEBP şəkilləri qəbul olunur");
        }

        String filename = UUID.randomUUID() + "." + extension;
        Path target = root.resolve(filename).normalize();
        if (!target.getParent().equals(root)) {
            throw new BadRequestException("Yolverilməz fayl adı");
        }
        try (var input = file.getInputStream()) {
            Files.copy(input, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Şəkil yaddaşa yazıla bilmədi", e);
        }
        return "/uploads/" + filename;
    }
}
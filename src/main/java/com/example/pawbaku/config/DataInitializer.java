package com.example.pawbaku.config;

import com.example.pawbaku.model.Animal;
import com.example.pawbaku.model.Listing;
import com.example.pawbaku.model.Report;
import com.example.pawbaku.model.ReportEvent;
import com.example.pawbaku.model.User;
import com.example.pawbaku.repository.AnimalRepository;
import com.example.pawbaku.repository.ListingRepository;
import com.example.pawbaku.repository.ReportEventRepository;
import com.example.pawbaku.repository.ReportRepository;
import com.example.pawbaku.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds a working demo database:
 * <ul>
 *   <li>the first administrator account (idempotent, only when none exists);</li>
 *   <li>demo users (a volunteer and a vet), animals, listings and street reports so the
 *       hosted preview starts alive without manual data entry.</li>
 * </ul>
 * Set {@code pawbaku.demo.seed=false} to keep the database completely clean.
 */
@Component
@ConditionalOnProperty(prefix = "pawbaku.bootstrap", name = "enabled", havingValue = "true", matchIfMissing = true)
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private static final String DEMO_PASSWORD = "PawBakuDemo1!";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AnimalRepository animalRepository;
    private final ListingRepository listingRepository;
    private final ReportRepository reportRepository;
    private final ReportEventRepository eventRepository;
    private final BootstrapProperties properties;
    private final DemoProperties demoProperties;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           AnimalRepository animalRepository,
                           ListingRepository listingRepository,
                           ReportRepository reportRepository,
                           ReportEventRepository eventRepository,
                           BootstrapProperties properties,
                           DemoProperties demoProperties) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.animalRepository = animalRepository;
        this.listingRepository = listingRepository;
        this.reportRepository = reportRepository;
        this.eventRepository = eventRepository;
        this.properties = properties;
        this.demoProperties = demoProperties;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        User admin = seedAdmin();
        if (demoProperties.seed()) {
            seedDemoData(admin);
        }
    }

    private User seedAdmin() {
        if (userRepository.existsByRole(User.Role.ADMIN)) {
            return userRepository.findAllByRole(User.Role.ADMIN).get(0);
        }
        BootstrapProperties.Admin admin = properties.admin();
        User user = User.builder()
                .username(admin.username())
                .email(admin.email())
                .password(passwordEncoder.encode(admin.password()))
                .fullName("PawBaku Administratoru")
                .role(User.Role.ADMIN)
                .active(true)
                .build();
        user = userRepository.save(user);
        log.info("Başlanğıc admin hesabı yaradıldı: {}", admin.username());
        return user;
    }

    private void seedDemoData(User admin) {
        if (listingRepository.countByStatus(Listing.Status.ACTIVE) > 0) {
            return;
        }

        User volunteer = ensureUser("vasif", "vasif@pawbaku.az", "Vasif Kərimov", User.Role.VOLUNTEER);
        User vet = ensureUser("nigar", "nigar@pawbaku.az", "Nigar Əliyeva", User.Role.VET);

        Animal reks = animal(admin, "Reks", Animal.Species.DOG, "Korgi", "Kürən-ağ",
                Animal.Size.SMALL, 18, "/hero-paw.jpg");
        Animal balaca = animal(admin, "Balaca sarı", Animal.Species.DOG, "Labrador", "Sarı",
                Animal.Size.LARGE, 8, "/mock-1108099.jpg");
        Animal sabir = animal(admin, "Sabir", Animal.Species.DOG, "Alman Çoban", "Qara-sarı",
                Animal.Size.LARGE, 36, "/mock-333083.jpg");
        Animal penche = animal(admin, "Pəncə", Animal.Species.DOG, "Qızıl retriver", "Qızılı",
                Animal.Size.MEDIUM, 6, "/hero-paw-2.jpg");

        listing(admin, reks, "FOUND", "40.3725", "49.8622", "Xətai", "Xətai metrosu, çıxış yanı",
                "Balaca korgi özünü itirmiş halda tapılıb, sahibini gözləyir.");
        listing(admin, balaca, "LOST", "40.3992", "49.8683", "Nizami", "Azadlıq prospekti 7, park sektor",
                "Sarı labrador saatlar əvvəl parkdan itib, yaxınlıqda görülüb.");
        listing(admin, sabir, "FOUND", "40.5163", "49.7642", "Sabunçu", "Bakıxanov qəsəbəsi, məktəb qarşısı",
                "Qara-sarı alman çoban məktəb qarşısında tək tapılıb.");
        listing(admin, penche, "LOST", "40.4203", "49.8726", "Nəsimi", "Koroğlu körpüsü, həyət",
                "Qızılı retriver həyətdən itib, xüsusi izi ürək formasındadır.");

        report(admin, volunteer, vet, "Zədəli it", "Sağ arxa ayağından yaralı — yerindəcə kömək lazımdır.",
                Report.Status.VET_CARE, "Binəqədi", "Bazar arxa yol", "40.4444", "49.8213");
        report(admin, volunteer, vet, "Ac it", "Bazar ətrafında üç gündür yemək axtarır, qorxaq.",
                Report.Status.VOLUNTEER_ASSIGNED, "Yasamal", null, "40.3721", "49.8012");
        report(admin, volunteer, vet, "Bala tapıldı", "Yağışda titrəyən bala kölgəliyə aparılıb, sahibi axtarılır.",
                Report.Status.VERIFIED, "Suraxanı", null, "40.4297", "49.9802");

        log.info("Demo məlumatlar toxumlandı (heyvanlar, elanlar, bildirişlər).");
    }

    private User ensureUser(String username, String email, String fullName, User.Role role) {
        return userRepository.findByUsernameIgnoreCase(username)
                .orElseGet(() -> userRepository.save(User.builder()
                        .username(username)
                        .email(email)
                        .password(passwordEncoder.encode(DEMO_PASSWORD))
                        .fullName(fullName)
                        .role(role)
                        .active(true)
                        .build()));
    }

    private Animal animal(User owner, String name, Animal.Species species, String breed, String color,
                          Animal.Size size, int ageMonths, String photoUrl) {
        return animalRepository.findByNameAndSpecies(name, species)
                .orElseGet(() -> animalRepository.save(Animal.builder()
                        .name(name)
                        .species(species)
                        .breed(breed)
                        .color(color)
                        .size(size)
                        .gender(Animal.Gender.UNKNOWN)
                        .ageMonths(ageMonths)
                        .photoUrl(photoUrl)
                        .createdBy(owner)
                        .build()));
    }

    private void listing(User owner, Animal animal, String kind, String lat, String lng,
                         String district, String address, String description) {
        listingRepository.save(Listing.builder()
                .kind(Listing.Kind.valueOf(kind))
                .status(Listing.Status.ACTIVE)
                .latitude(Double.parseDouble(lat))
                .longitude(Double.parseDouble(lng))
                .district(district)
                .address(address)
                .description(description)
                .createdBy(owner)
                .animal(animal)
                .build());
    }

    private void report(User owner, User volunteer, User vet, String title, String description,
                        Report.Status status, String district, String address, String lat, String lng) {
        Report report = reportRepository.save(Report.builder()
                .title(title)
                .description(description)
                .species(Animal.Species.DOG)
                .district(district)
                .address(address)
                .latitude(Double.parseDouble(lat))
                .longitude(Double.parseDouble(lng))
                .reporter(owner)
                .status(status)
                .build());

        // Reconstruct an audit trail that matches the seeded status.
        reportStage(report, owner, null, Report.Status.REPORTED, "Bildiriş qeydə alındı");
        if (status.ordinal() >= Report.Status.VERIFIED.ordinal()) {
            report.setVerifiedBy(owner);
            reportStage(report, owner, Report.Status.REPORTED, Report.Status.VERIFIED, "Moderator təsdiqlədi");
        }
        if (status.ordinal() >= Report.Status.VOLUNTEER_ASSIGNED.ordinal()) {
            report.setVolunteer(volunteer);
            reportStage(report, volunteer, Report.Status.VERIFIED, Report.Status.VOLUNTEER_ASSIGNED, "Könüllü yola çıxdı");
        }
        if (status.ordinal() >= Report.Status.VET_CARE.ordinal()) {
            report.setVet(vet);
            reportStage(report, vet, Report.Status.VOLUNTEER_ASSIGNED, Report.Status.VET_CARE, "Baytar qəbulu");
        }
        reportRepository.save(report);
    }

    private void reportStage(Report report, User actor, Report.Status from, Report.Status to, String note) {
        eventRepository.save(ReportEvent.builder()
                .report(report)
                .fromStatus(from)
                .toStatus(to)
                .actor(actor)
                .note(note)
                .build());
    }

    /** Bootstrap settings bound from {@code pawbaku.bootstrap.*}. */
    @ConfigurationProperties(prefix = "pawbaku.bootstrap")
    public record BootstrapProperties(Admin admin) {

        public BootstrapProperties {
            if (admin == null) {
                throw new IllegalStateException("pawbaku.bootstrap.admin tələb olunur");
            }
            admin.validate();
        }

        public record Admin(String username, String password, String email) {

            private static final String DEFAULT_USERNAME = "admin";

            public Admin {
                if (username == null || username.isBlank()) {
                    username = DEFAULT_USERNAME;
                }
                if (email == null || email.isBlank()) {
                    email = username + "@pawbaku.az";
                }
                if (password == null || password.isBlank()) {
                    throw new IllegalStateException(
                            "pawbaku.bootstrap.admin.password tələb olunur (minimum 8 simvol)");
                }
            }

            void validate() {
                if (password.length() < 8) {
                    throw new IllegalStateException(
                            "Başlanğıc admin parolu ən azı 8 simvol olmalıdır");
                }
            }
        }
    }

    /** Demo-data toggle bound from {@code pawbaku.demo.seed}. */
    @ConfigurationProperties(prefix = "pawbaku.demo")
    public record DemoProperties(boolean seed) {
    }
}
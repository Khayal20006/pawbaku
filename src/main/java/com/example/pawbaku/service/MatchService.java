package com.example.pawbaku.service;

import java.util.List;
import java.util.Objects;

import com.example.pawbaku.model.Animal;
import com.example.pawbaku.model.Listing;
import com.example.pawbaku.repository.ListingRepository;
import org.springframework.stereotype.Service;

/**
 * Uyğunluq (match) sistemi: itkin ↔ tapılmış elanları çəkilər ilə müqayisə edir və 0–100 bal verir.
 *
 * <p>Çəkilər (toplam 100):
 * <ul>
 *   <li>Növ (30) — eyni heyvan növü tam bal, fərqli növ 0;</li>
 *   <li>Əndazə/ölçü (15) — eyni ölçü sinfi;</li>
 *   <li>Rəng (15) — mətn normalizasiyasından sonra tam/altəzv uyğunluğu;</li>
 *   <li>Cins (10) — eyni cins;</li>
 *   <li>Mənzil/məsafə (20) — Haversine km, ≤50 m tam bal, 5 km-də 0 (xətti azalır);</li>
 *   <li>Vaxt pəncərəsi (10) — ≤24 saat fərq tam bal, 7 gündə 0 (xətti azalır).</li>
 * </ul>
 * Hədd balı 65-dir — ondan yuxarı elan "uyğunlaşdırmaya namizəd" sayılır.
 */
@Service
public class MatchService {

    /** Haversine məsafəsində tam bal radiusu (km). */
    private static final double DISTANCE_FULL_KM = 0.05;

    /** Məsafənin 0-a düşdüyü radius (km). */
    private static final double DISTANCE_FLOOR_KM = 5.0;

    /** Vaxt pəncərəsində tam bal (saat). 24 saat — plana uyğun. */
    private static final double TIME_FULL_HOURS = 24.0;

    /** Vaxt pəncərəsinin 0-a düşdüyü müddət (saat = 7 gün). */
    private static final double TIME_FLOOR_HOURS = 168.0;

    private static final int W_SPECIES = 30;
    private static final int W_SIZE = 15;
    private static final int W_COLOR = 15;
    private static final int W_GENDER = 10;
    private static final int W_DISTANCE = 20;
    private static final int W_TIME = 10;

    private final ListingRepository listingRepository;

    public MatchService(ListingRepository listingRepository) {
        this.listingRepository = listingRepository;
    }

    /** Ən yaxşı uyğunluq (qarşı növ, ACTIVE elanlar arasında). */
    public Match bestMatch(Listing listing) {
        Listing.Kind opposite = opposite(listing.getKind());
        List<Listing> candidates = listingRepository.findByStatusAndKind(Listing.Status.ACTIVE, opposite);
        return bestMatchOver(listing, candidates);
    }

    /** Ən yaxşı uyğunluq — həyata keçirilmiş namizəd hovuzu üzərində (self və eyni növ atlanır). */
    public Match bestMatchOver(Listing listing, List<Listing> candidates) {
        Match best = null;
        for (Listing candidate : candidates) {
            if (Objects.equals(candidate.getId(), listing.getId())
                    || candidate.getKind() == listing.getKind()) {
                continue;
            }
            Match score = evaluate(listing, candidate);
            if (best == null || score.score() > best.score()) {
                best = score;
            }
        }
        return best;
    }

    private static Listing.Kind opposite(Listing.Kind kind) {
        return kind == Listing.Kind.LOST ? Listing.Kind.FOUND : Listing.Kind.LOST;
    }

    /** Ən yaxşı uyğunluğun balı — uyğunluq yoxdursa 0. */
    public int matchScore(Listing listing) {
        Match best = bestMatch(listing);
        return best == null ? 0 : best.score();
    }

    /** İki elan arasında istiqamətindən asılı olmayan qoşa bal (0–100). */
    public Match evaluate(Listing left, Listing right) {
        Animal a = left.getAnimal();
        Animal b = right.getAnimal();

        int score = 0;
        if (a.getSpecies() == b.getSpecies()) {
            score += W_SPECIES;
        }
        if (a.getSize() != null && a.getSize() == b.getSize()) {
            score += W_SIZE;
        }
        score += (int) Math.round(colorMatch(a.getColor(), b.getColor()) * W_COLOR);
        if (a.getGender() == b.getGender()) {
            score += W_GENDER;
        }
        score += (int) Math.round(distanceFactor(left, right) * W_DISTANCE);
        score += (int) Math.round(timeFactor(left, right) * W_TIME);

        return new Match(Math.min(100, score), right.getId(), right.getAnimal().getName());
    }

    /** 0..1 — məsafə:<=50 m 1, 5 km və yuxarı 0. */
    static double distanceFactor(Listing left, Listing right) {
        double km = haversineKm(left.getLatitude(), left.getLongitude(),
                right.getLatitude(), right.getLongitude());
        if (km <= DISTANCE_FULL_KM) {
            return 1.0;
        }
        return Math.max(0.0, 1.0 - (km - DISTANCE_FULL_KM) / DISTANCE_FLOOR_KM);
    }

    /** 0..1 — vaxt fərqi:[0,24] saat 1, 168+ saat 0. */
    static double timeFactor(Listing left, Listing right) {
        long hours = Math.abs(java.time.Duration.between(left.getCreatedAt(), right.getCreatedAt()).toHours());
        if (hours <= TIME_FULL_HOURS) {
            return 1.0;
        }
        return Math.max(0.0, 1.0 - (hours - TIME_FULL_HOURS) / (TIME_FLOOR_HOURS - TIME_FULL_HOURS));
    }

    /** 0..1 — rəng mətnlərini normallaşdırıb tam/altəzv uyğunluğuna görə. */
    static double colorMatch(String left, String right) {
        if (left == null || right == null) {
            return 0.0;
        }
        String a = normalizeColor(left);
        String b = normalizeColor(right);
        if (a.isEmpty() || b.isEmpty()) {
            return 0.0;
        }
        if (a.equals(b)) {
            return 1.0;
        }
        return (a.contains(b) || b.contains(a)) ? 0.6 : 0.0;
    }

    private static String normalizeColor(String value) {
        return value.toLowerCase().trim().replaceAll("\\s+", " ");
    }

    /** Haversine düsturu — iki koordinat arası məsafə (km). */
    static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double earthRadiusKm = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }

    /** Bir elan üçün hesablanmış uyğunluq nəticəsi. */
    public record Match(int score, Long listingId, String listingName) {
    }
}
package com.example.pawbaku.repository;

import java.util.List;

import com.example.pawbaku.model.AdoptablePet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdoptablePetRepository extends JpaRepository<AdoptablePet, Long> {

    List<AdoptablePet> findByStatusOrderByIdDesc(AdoptablePet.PetStatus status);

    long countByStatus(AdoptablePet.PetStatus status);
}
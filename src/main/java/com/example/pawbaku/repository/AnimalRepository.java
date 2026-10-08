package com.example.pawbaku.repository;

import java.util.Optional;

import com.example.pawbaku.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

    Optional<Animal> findByNameAndSpecies(String name, Animal.Species species);
}
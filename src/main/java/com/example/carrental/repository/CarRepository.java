package com.example.carrental.repository;


import com.example.carrental.entity.Cars.Car;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByAgencyId(Long agencyId);
}

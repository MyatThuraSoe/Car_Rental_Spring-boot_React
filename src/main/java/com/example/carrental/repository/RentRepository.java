package com.example.carrental.repository;


import com.example.carrental.entity.Rent.Rent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentRepository extends JpaRepository<Rent, Long> {
    List<Rent> findByRentStatus(Rent.RentStatus rentStatus);
}

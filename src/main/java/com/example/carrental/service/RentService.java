package com.example.carrental.service;



import com.example.carrental.entity.Rent.Rent;
import com.example.carrental.repository.RentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RentService {

    @Autowired
    private RentRepository rentRepository;

    public void startRent(Long rentId) {
        Rent rent = rentRepository.findById(rentId)
                .orElseThrow(() -> new RuntimeException("Rent not found"));

        if (!rent.getRentStatus().equals(Rent.RentStatus.NOT_STARTED)) {
            throw new IllegalStateException("Rent must be in NOT_STARTED status to start.");
        }

        rent.setRentStatus(Rent.RentStatus.ONGOING);
        rentRepository.save(rent);
    }

    public void completeRent(Long rentId) {
        Rent rent = rentRepository.findById(rentId)
                .orElseThrow(() -> new RuntimeException("Rent not found"));

        if (!rent.getRentStatus().equals(Rent.RentStatus.ONGOING)) {
            throw new IllegalStateException("Rent must be in ONGOING status to complete.");
        }

        rent.setRentStatus(Rent.RentStatus.COMPLETED);
        rentRepository.save(rent);
    }
}

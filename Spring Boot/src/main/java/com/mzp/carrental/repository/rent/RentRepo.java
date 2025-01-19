package com.mzp.carrental.repository.rent;

import com.mzp.carrental.entity.Rent.Rent;
import com.mzp.carrental.entity.Rent.RentalOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RentRepo extends JpaRepository<Rent,Long> {
    Rent findByRentalOrder(RentalOrder rentalOrder);

    List<Rent> findByCarId(Long carId);

    List<Rent> findByCustomerId(Integer customerId);
}

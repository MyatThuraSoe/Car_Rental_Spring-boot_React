package com.mzp.carrental.repository.rent;

import com.mzp.carrental.entity.Rent.Rent;
import com.mzp.carrental.entity.Rent.RentalOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RentRepo extends JpaRepository<Rent,Long> {
    Rent findByRentalOrder(RentalOrder rentalOrder);

    List<Rent> findByCarId(Long carId);

    List<Rent> findByCustomerId(Integer customerId);



    boolean existsByCarIdAndStartDateBeforeAndEndDateAfter(Long id, LocalDate endDate, LocalDate startDate);

    //boolean existsByOrderId(Long orderId);

    boolean existsByRentalOrder(Optional<RentalOrder> byId);

    //boolean existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndOrderIdNot(Long id, LocalDate endDate, LocalDate startDate, Long id1);
}

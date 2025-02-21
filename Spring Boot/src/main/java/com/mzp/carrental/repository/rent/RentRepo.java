package com.mzp.carrental.repository.rent;

import com.mzp.carrental.entity.Rent.Rent;
import com.mzp.carrental.entity.Rent.RentalOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RentRepo extends JpaRepository<Rent,Long> {
    Rent findByRentalOrder(RentalOrder rentalOrder);

    List<Rent> findByCarId(Long carId);

    List<Rent> findByCustomerId(Integer customerId);

    @Query("""
    SELECT r FROM Rent r
    WHERE r.car.agency.id = :agencyId
    ORDER BY r.id DESC
""")
    List<Rent> findByAgencyId(@Param("agencyId") Integer agencyId);


    boolean existsByCarIdAndStartDateBeforeAndEndDateAfter(Long id, LocalDate endDate, LocalDate startDate);

    //boolean existsByOrderId(Long orderId);

    boolean existsByRentalOrder(Optional<RentalOrder> byId);

    @Query("""
    SELECT COUNT(r) > 0 FROM Rent r 
    WHERE r.car.id = :carId 
    AND r.rentStatus IN ('NOT_STARTED', 'ONGOING')
    AND (
        (r.startDate <= :endDate AND r.endDate >= :startDate)
    )
    ORDER BY r.id DESC
""")
    boolean existsOverlappingActiveRent(
            @Param("carId") Long carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );


    boolean existsByCustomerIdAndCarId(Integer id, Long carId);

    //boolean existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndOrderIdNot(Long id, LocalDate endDate, LocalDate startDate, Long id1);
}

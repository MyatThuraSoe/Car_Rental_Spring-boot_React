package com.mzp.carrental.repository.rent;

import com.mzp.carrental.entity.Rent.RentalOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RentalOrderRepo extends JpaRepository<RentalOrder,Long> {
    List<RentalOrder> findByCustomer_Id(Integer customerId);

    @Query("SELECT ro FROM RentalOrder ro WHERE ro.car.agency.id = :agencyId")
    List<RentalOrder> findByAgencyId(@Param("agencyId") Integer agencyId);

    @Query("SELECT ro FROM RentalOrder ro WHERE ro.car.id = :carId")
    List<RentalOrder> findByCarId(@Param("carId") Long carId);

    @Query("SELECT ro FROM RentalOrder ro WHERE ro.customer.id = :customerId")
    List<RentalOrder> findByCustomerId(Integer customerId);

}

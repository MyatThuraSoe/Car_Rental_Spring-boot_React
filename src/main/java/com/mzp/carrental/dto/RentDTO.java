package com.mzp.carrental.dto;

import com.mzp.carrental.entity.Rent.Rent;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RentDTO {
    private Long id;
    private Long carId;
    private Integer customerId;
    private LocalDate startDate;
    private LocalDate endDate;


    private boolean includeDriver;
    private double totalPrice;

    private Rent.RentStatus rentStatus;

    public enum RentStatus {
        NOT_STARTED, ONGOING, COMPLETED
    }

    public Rent.RentStatus getRentStatus() {
        return rentStatus;
    }

    public void setRentStatus(Rent.RentStatus rentStatus) {
        this.rentStatus = rentStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }


    public boolean isIncludeDriver() {
        return includeDriver;
    }

    public void setIncludeDriver(boolean includeDriver) {
        this.includeDriver = includeDriver;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    @Override
    public String toString() {
        return "RentalOrderDTO{" +
                "carId=" + carId +
                ", customerId=" + customerId +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", includeDriver=" + includeDriver +
                ", totalPrice=" + totalPrice +
                '}';
    }
}

package com.mzp.carrental.dto;

import com.mzp.carrental.entity.Rent.RentalOrder;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RentalOrderDTO {
    private Long id;
    private Long carId;
    private Integer customerId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String pickUpLocation;
    private String dropOffLocation;

    private boolean includeDriver;
    private double totalPrice;

    private RentalOrder.OrderStatus status;

    public enum OrderStatus {
        CANCEL, PENDING, APPROVED, DENIED
    }

    public RentalOrder.OrderStatus getStatus() {
        return status;
    }

    public void setStatus(RentalOrder.OrderStatus status) {
        this.status = status;
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

    public String getPickUpLocation() {
        return pickUpLocation;
    }

    public void setPickUpLocation(String pickUpLocation) {
        this.pickUpLocation = pickUpLocation;
    }

    public String getDropOffLocation() {
        return dropOffLocation;
    }

    public void setDropOffLocation(String dropOffLocation) {
        this.dropOffLocation = dropOffLocation;
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
                ", pickUpLocation='" + pickUpLocation + '\'' +
                ", dropOffLocation='" + dropOffLocation + '\'' +
                ", includeDriver=" + includeDriver +
                ", totalPrice=" + totalPrice +
                '}';
    }
}

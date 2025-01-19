package com.mzp.carrental.entity.Cars;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.mzp.carrental.entity.Users.Agency;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agency_id", nullable = false)
    @JsonBackReference // Avoids circular reference
    private Agency agency;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    private String imageName;
    private String imageType;
    @Lob
    private byte[] imageData;

    @Column(nullable = false, unique = true)
    private String licensePlate;

    @Column(nullable = false)
    private int year;

    @Column(nullable = false, unique = true)
    private String vin; // Vehicle Identification Number

    @Column(nullable = false)
    private int mileage;

    @Column(nullable = false)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Transmission transmission;

    @Column(nullable = false)
    private int seats;


    @Column(nullable = true)
    private String features;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private double pricePerDay;

    @Column(nullable = false)
    private double driverFeePerDay;

    public enum Category {
        SUV, HATCHBACK, SEDAN, COUPE, CONVERTIBLE, TRUCK, VAN, OTHER
    }

    public enum FuelType {
        PETROL, DIESEL, ELECTRIC, HYBRID, OTHER
    }

    public enum Transmission {
        AUTOMATIC, MANUAL
    }

    // getters and setters


    public int getSeats() {
        return seats;
    }

    public void setSeats(int seats) {
        this.seats = seats;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Agency getAgency() {
        return agency;
    }

    public void setAgency(Agency agency) {
        this.agency = agency;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }


    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public int getMileage() {
        return mileage;
    }

    public void setMileage(int mileage) {
        this.mileage = mileage;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public Transmission getTransmission() {
        return transmission;
    }

    public void setTransmission(Transmission transmission) {
        this.transmission = transmission;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    @Override
    public String toString() {
        return "Car{" +
                "id=" + id +
                ", brand='" + brand + '\'' +
                ", model='" + model + '\'' +
                ", licensePlate='" + licensePlate + '\'' +
                ", year=" + year +
                ", color='" + color + '\'' +
                ", category=" + category +
                ", fuelType=" + fuelType +
                ", transmission=" + transmission +
                ", seats=" + seats +
                ", pricePerDay=" + pricePerDay +
                ", description='" + description + '\'' +
                '}'; // Excluding 'agency' to prevent recursion
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    public String getImageType() {
        return imageType;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public double getDriverFeePerDay() {
        return driverFeePerDay;
    }

    public void setDriverFeePerDay(double driverFeePerDay) {
        this.driverFeePerDay = driverFeePerDay;
    }
}

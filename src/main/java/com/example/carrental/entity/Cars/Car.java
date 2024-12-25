package com.example.carrental.entity.Cars;


import com.example.carrental.entity.Users.Agency;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) // Lazy fetch for performance, agency is mandatory
    @JoinColumn(name = "agency_id", nullable = false) // Foreign key column in the Car table
    private Agency agency;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @ElementCollection
    @CollectionTable(name = "car_images", joinColumns = @JoinColumn(name = "car_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

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

    @ElementCollection
    @CollectionTable(name = "car_features", joinColumns = @JoinColumn(name = "car_id"))
    @Column(name = "feature")
    private List<String> features;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private double pricePerDay;

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

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
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

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
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
                ", agency=" + agency +
                ", brand='" + brand + '\'' +
                ", model='" + model + '\'' +
                ", imageUrls=" + imageUrls +
                ", licensePlate='" + licensePlate + '\'' +
                ", year=" + year +
                ", vin='" + vin + '\'' +
                ", mileage=" + mileage +
                ", color='" + color + '\'' +
                ", category=" + category +
                ", fuelType=" + fuelType +
                ", transmission=" + transmission +
                ", seats=" + seats +
                ", features=" + features +
                ", description='" + description + '\'' +
                ", pricePerDay=" + pricePerDay +
                '}';
    }
}

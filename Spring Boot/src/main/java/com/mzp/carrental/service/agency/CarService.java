package com.mzp.carrental.service.agency;


import com.mzp.carrental.dto.ReqRes;
import com.mzp.carrental.entity.Cars.Car;

import com.mzp.carrental.entity.Users.Agency;
import com.mzp.carrental.repository.agency.AgencyRepo;
import com.mzp.carrental.repository.agency.CarRepo;
import com.mzp.carrental.service.OurUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarRepo carRepo;

    @Autowired
    private AgencyRepo agencyRepo;

    @Autowired
    private OurUserDetailsService userDetailsService;

    // Helper method to get the current logged-in agency
    private Agency getCurrentAgency() {
        String email = userDetailsService.getCurrentUserEmail();
        return agencyRepo.findByOurUsers_Email(email)
                .orElseThrow(() -> new RuntimeException("Agency not found"));
    }

    // Get all cars for the current agency
    public List<Car> getAllCarsForCurrentAgency() {
        Agency currentAgency = getCurrentAgency();
        return carRepo.findByAgency(currentAgency);
    }

    // Get a car by ID for the current agency
    public Car getCarByIdForCurrentAgency(Long id) {
        Agency currentAgency = getCurrentAgency();
        return carRepo.findByIdAndAgency(id, currentAgency)
                .orElse(null);
    }

    // Create a car for the current agency
    public Car createCarForCurrentAgency(Car car) {
        Agency currentAgency = getCurrentAgency();
        car.setAgency(currentAgency);
        return carRepo.save(car);
    }

    // Update a car for the current agency
    public Car updateCarForCurrentAgency(Long id, Car carDetails) {
        Agency currentAgency = getCurrentAgency();
        return carRepo.findByIdAndAgency(id, currentAgency)
                .map(existingCar -> {
                    existingCar.setBrand(carDetails.getBrand());
                    existingCar.setModel(carDetails.getModel());
                    existingCar.setYear(carDetails.getYear());
                    existingCar.setLicensePlate(carDetails.getLicensePlate());
                    existingCar.setPricePerDay(carDetails.getPricePerDay());
                    existingCar.setCategory(carDetails.getCategory());
                    existingCar.setFuelType(carDetails.getFuelType());
                    existingCar.setTransmission(carDetails.getTransmission());
                    existingCar.setSeats(carDetails.getSeats());
                    existingCar.setColor(carDetails.getColor());
                    existingCar.setDescription(carDetails.getDescription());
                    return carRepo.save(existingCar);
                }).orElse(null);
    }

    // Delete a car for the current agency
    public boolean deleteCarForCurrentAgency(Long id) {
        Agency currentAgency = getCurrentAgency();
        return carRepo.findByIdAndAgency(id, currentAgency)
                .map(car -> {
                    carRepo.delete(car);
                    return true;
                }).orElse(false);
    }


    // Car View Controller ----------------Public ----------------------------
    // Get all cars
    public List<Car> getAllCars() {
        return carRepo.findAll();
    }

    // Get a car by ID
    public Car getCarById(Long id) {
        return carRepo.findById(id).orElse(null);
    }

    // Filter cars based on query parameters
    public List<Car> filterCars(String brand, String model, Integer seats, String category, String fuelType) {
        // Example filtering using custom repository method or dynamic query
        if (brand == null && model == null && seats == null && category == null && fuelType == null) {
            return getAllCars(); // Return all cars if no filters are provided
        }
        return carRepo.findByFilters(brand, model, seats, category, fuelType);
    }



}


package com.mzp.carrental.service.agency;


import com.mzp.carrental.entity.Cars.Car;

import com.mzp.carrental.entity.OurUsers;
import com.mzp.carrental.entity.Users.Agency;
import com.mzp.carrental.repository.UsersRepo;
import com.mzp.carrental.repository.agency.AgencyRepo;
import com.mzp.carrental.repository.agency.CarRepo;
import com.mzp.carrental.service.OurUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CarService {

    @Autowired
    private CarRepo carRepo;

    @Autowired
    private AgencyRepo agencyRepo;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private OurUserDetailsService userDetailsService;

    // Helper method to get the current logged-in agency
    public Agency getCurrentAgency() {
        String email = userDetailsService.getCurrentUserEmail();
        System.out.println("Email in getCurrentAgnecy is " + email);
        Optional<OurUsers> user = usersRepo.findByEmail(email);
        return agencyRepo.findById(user.get().getId())
                .orElseThrow(() -> new RuntimeException("Agency not found"));
    }

    // Get the email of the current agency
    private String getCurrentAgencyEmail() {
        Agency currentAgency = getCurrentAgency();
        return currentAgency.getOurUsers().getEmail(); // Access the email via the associated OurUsers entity
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

    public Car createCarForCurrentAgency(Car car, MultipartFile image) throws IOException {
        Agency currentAgency = getCurrentAgency();
        car.setAgency(currentAgency);

        // Ensure we update the product and image details if provided
        if (image != null) {
            car.setImageData(image.getBytes());
            car.setImageName(image.getOriginalFilename());
            car.setImageType(image.getContentType());
        }
        return carRepo.save(car); // Save updated product
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
                    existingCar.setDriverFeePerDay(carDetails.getDriverFeePerDay());
                    existingCar.setCategory(carDetails.getCategory());
                    existingCar.setFuelType(carDetails.getFuelType());
                    existingCar.setTransmission(carDetails.getTransmission());
                    existingCar.setSeats(carDetails.getSeats());
                    existingCar.setColor(carDetails.getColor());
                    existingCar.setDescription(carDetails.getDescription());
                    existingCar.setDriverFeePerDay(carDetails.getDriverFeePerDay());
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

    public Car updateCarWithImage(Long id, String brand, String model, int year, String licensePlate, String vin, int mileage, String color, Car.Category category, Car.FuelType fuelType, Car.Transmission transmission, int seats, String features, String description, double pricePerDay, double driverFeePerDay, MultipartFile imageFile) throws IOException {
        Agency currentAgency = getCurrentAgency();
        return carRepo.findByIdAndAgency(id, currentAgency)
                .map(car -> {
                    car.setBrand(brand);
                    car.setModel(model);
                    car.setYear(year);
                    car.setLicensePlate(licensePlate);
                    car.setVin(vin);
                    car.setMileage(mileage);
                    car.setColor(color);
                    car.setCategory(category);
                    car.setFuelType(fuelType);
                    car.setTransmission(transmission);
                    car.setSeats(seats);
                    car.setFeatures(features);
                    car.setDescription(description);
                    car.setPricePerDay(pricePerDay);
                    car.setDriverFeePerDay(driverFeePerDay);
                    if (imageFile != null) {
                        try {
                            car.setImageName(imageFile.getOriginalFilename());
                            car.setImageType(imageFile.getContentType());
                            car.setImageData(imageFile.getBytes());
                        } catch (IOException e) {
                            throw new RuntimeException("Failed to process image file", e);
                        }
                    }
                    return carRepo.save(car);
                })
                .orElse(null);
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

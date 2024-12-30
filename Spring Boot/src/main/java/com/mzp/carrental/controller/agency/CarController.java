package com.mzp.carrental.controller.agency;

import com.mzp.carrental.dto.ReqRes;
import com.mzp.carrental.entity.Cars.Car;
import com.mzp.carrental.service.agency.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agency/cars")
public class CarController {

    @Autowired
    private CarService carService;

    // Get all cars for the current agency
    @GetMapping
    public ResponseEntity<List<Car>> getAllCarsForAgency() {
        List<Car> cars = carService.getAllCarsForCurrentAgency();
        return cars.isEmpty()
                ? ResponseEntity.status(HttpStatus.NO_CONTENT).build()
                : ResponseEntity.ok(cars);
    }

    // Get a specific car by ID for the current agency
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Car car = carService.getCarByIdForCurrentAgency(id);
        return car != null
                ? ResponseEntity.ok(car)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Create a car for the current agency
    @PostMapping
    public ResponseEntity<Car> createCar(@RequestBody Car car) {
        Car createdCar = carService.createCarForCurrentAgency(car);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCar);
    }

    // Update a car for the current agency
    @PutMapping("/{id}")
    public ResponseEntity<Car> updateCar(@PathVariable Long id, @RequestBody Car car) {
        Car updatedCar = carService.updateCarForCurrentAgency(id, car);
        return updatedCar != null
                ? ResponseEntity.ok(updatedCar)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Delete a car for the current agency
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        boolean isDeleted = carService.deleteCarForCurrentAgency(id);
        return isDeleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}

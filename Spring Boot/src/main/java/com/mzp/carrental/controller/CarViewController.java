package com.mzp.carrental.controller;

import com.mzp.carrental.entity.Cars.Car;
import com.mzp.carrental.service.agency.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/view/cars")
public class CarViewController {

    @Autowired
    private CarService carService;

    // Route to get all cars
    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        List<Car> cars = carService.getAllCars();
        return cars.isEmpty()
                ? ResponseEntity.status(HttpStatus.NO_CONTENT).build()
                : ResponseEntity.ok(cars);
    }

    // Route to get a car by ID
    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Car car = carService.getCarById(id);
        return car != null
                ? ResponseEntity.ok(car)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Route to filter cars
    @GetMapping("/filter")
    public ResponseEntity<List<Car>> filterCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer seats,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String fuelType) {
        List<Car> cars = carService.filterCars(brand, model, seats, category, fuelType);
        return cars.isEmpty()
                ? ResponseEntity.status(HttpStatus.NO_CONTENT).build()
                : ResponseEntity.ok(cars);
    }
}

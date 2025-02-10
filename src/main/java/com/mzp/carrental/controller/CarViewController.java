package com.mzp.carrental.controller;

import com.mzp.carrental.entity.Cars.Car;
import com.mzp.carrental.service.agency.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @GetMapping("/test/{id}")
    public ResponseEntity<Car> getCarForTest(@PathVariable Long id) {
        Car car = carService.getCarById(id);
        System.out.println("Inside /test/id/");
        if (car != null) {
            System.out.println("not found test cars");
            System.out.println(car.toString());
            return ResponseEntity.ok(car);
        } else {
            // Create a test car object with mock data
            Car testCar = new Car();
            testCar.setId(1L); // Example ID
            testCar.setBrand("Test Brand");
            testCar.setModel("Test Model");
            testCar.setLicensePlate("TEST123");
            testCar.setYear(2022);
            testCar.setVin("1HGCM82633A123456"); // Example VIN
            testCar.setMileage(1000);
            testCar.setColor("Red");
            testCar.setCategory(Car.Category.SUV);
            testCar.setFuelType(Car.FuelType.PETROL);
            testCar.setTransmission(Car.Transmission.AUTOMATIC);
            testCar.setSeats(5);
            testCar.setFeatures("Air Conditioning Navigation System");
            testCar.setDescription("This is a test car.");
            testCar.setPricePerDay(50.0);


            System.out.println("Responsed Test cars");
            return ResponseEntity.ok(testCar);
        }
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

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getCarImage(@PathVariable Long id) {
        Car car = carService.getCarById(id);
        if (car != null && car.getImageData() != null) {
            System.out.println("Image of  car id="+ car.getId() + " is responsed");
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(car.getImageType())) // Dynamically set content type
                    .body(car.getImageData());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}

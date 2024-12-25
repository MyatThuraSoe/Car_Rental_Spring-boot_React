package com.example.carrental.controller;


import com.example.carrental.entity.Cars.Car;
import com.example.carrental.entity.Order.Order;
import com.example.carrental.entity.Rent.Rent;
import com.example.carrental.service.AgencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agency")
public class AgencyController {

    @Autowired
    private AgencyService agencyService;

    // 1. Get all cars owned by the agency
    @GetMapping("/cars")
    public ResponseEntity<List<Car>> getAgencyCars() {
        List<Car> cars = agencyService.getAllAgencyCars();
        return ResponseEntity.ok(cars);
    }

    // 2. Get a specific car by ID owned by the agency
    @GetMapping("/car/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable Long id) {
        Car car = agencyService.getCarById(id);
        return ResponseEntity.ok(car);
    }

    // 3. Add or update a car owned by the agency
    @PostMapping("/car")
    public ResponseEntity<Car> addOrUpdateCar(@RequestBody Car car) {
        Car savedCar = agencyService.saveOrUpdateCar(car);
        return ResponseEntity.ok(savedCar);
    }

    // 4. Delete a car owned by the agency
    @DeleteMapping("/car/{id}")
    public ResponseEntity<String> deleteCar(@PathVariable Long id) {
        agencyService.deleteCar(id);
        return ResponseEntity.ok("Car deleted successfully.");
    }

    // 5. Get all orders for the agency
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = agencyService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // 6. Approve or deny an order
    @PostMapping("/order/{orderId}/approve")
    public ResponseEntity<String> approveOrder(@PathVariable Long orderId) {
        agencyService.approveOrder(orderId);
        return ResponseEntity.ok("Order approved.");
    }

    @PostMapping("/order/{orderId}/deny")
    public ResponseEntity<String> denyOrder(@PathVariable Long orderId) {
        agencyService.denyOrder(orderId);
        return ResponseEntity.ok("Order denied.");
    }

    // 7. Get all rents for the agency
    @GetMapping("/rents")
    public ResponseEntity<List<Rent>> getAllRents() {
        List<Rent> rents = agencyService.getAllRents();
        return ResponseEntity.ok(rents);
    }
}

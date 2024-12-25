package com.example.carrental.controller;


import com.example.carrental.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/{carId}/unavailable-dates")
    public ResponseEntity<List<LocalDate>> getUnavailableDates(@PathVariable Long carId) {
        List<LocalDate> unavailableDates = orderService.getUnavailableDates(carId);
        return ResponseEntity.ok(unavailableDates);
    }

    @PostMapping("/{orderId}/approve")
    public ResponseEntity<?> approveOrder(@PathVariable Long orderId) {
        orderService.approveOrderAndCreateRent(orderId);
        return ResponseEntity.ok("Order approved and Rent created.");
    }
}

package com.example.carrental.controller;


import com.example.carrental.service.RentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rents")
public class RentController {

    @Autowired
    private RentService rentService;

    @PostMapping("/{rentId}/start")
    public ResponseEntity<?> startRent(@PathVariable Long rentId) {
        rentService.startRent(rentId);
        return ResponseEntity.ok("Rent started.");
    }

    @PostMapping("/{rentId}/complete")
    public ResponseEntity<?> completeRent(@PathVariable Long rentId) {
        rentService.completeRent(rentId);
        return ResponseEntity.ok("Rent completed.");
    }
}

package com.example.carrental.service;




import com.example.carrental.entity.Cars.Car;
import com.example.carrental.entity.Order.Order;
import com.example.carrental.entity.Rent.Rent;
import com.example.carrental.repository.CarRepository;
import com.example.carrental.repository.OrderRepository;
import com.example.carrental.repository.RentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgencyService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RentRepository rentRepository;

    // 1. Get all cars owned by the agency
    public List<Car> getAllAgencyCars() {
        // Replace with the current agency's ID
        Long agencyId = getCurrentAgencyId();
        return carRepository.findByAgencyId(agencyId);
    }

    // 2. Get a specific car by ID
    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
    }

    // 3. Add or update a car
    public Car saveOrUpdateCar(Car car) {
        // Set the agency ID dynamically (e.g., from logged-in agency user)
        car.setAgencyId(getCurrentAgencyId());
        return carRepository.save(car);
    }

    // 4. Delete a car
    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }

    // 5. Get all orders
    public List<Order> getAllOrders() {
        // Replace with the current agency's ID
        Long agencyId = getCurrentAgencyId();
        return orderRepository.findByAgencyId(agencyId);
    }

    // 6. Approve an order
    public void approveOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getStatus().equals(Order.OrderStatus.PENDING)) {
            throw new IllegalStateException("Order is not in a pending state.");
        }
        order.setStatus(Order.OrderStatus.APPROVED);
        orderRepository.save(order);
    }

    // 7. Deny an order
    public void denyOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getStatus().equals(Order.OrderStatus.PENDING)) {
            throw new IllegalStateException("Order is not in a pending state.");
        }
        order.setStatus(Order.OrderStatus.DENIED);
        orderRepository.save(order);
    }

    // 8. Get all rents
    public List<Rent> getAllRents() {
        // Replace with the current agency's ID
        Long agencyId = getCurrentAgencyId();
        return rentRepository.findByCarAgencyId(agencyId);
    }

    // Mock current agency ID (replace with actual authentication logic)
    private Long getCurrentAgencyId() {
        return 1L; // Example static agency ID for demo purposes
    }
}

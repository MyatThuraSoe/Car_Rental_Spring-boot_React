package com.example.carrental.service;


import com.example.carrental.entity.Order.Order;
import com.example.carrental.entity.Rent.Rent;
import com.example.carrental.repository.OrderRepository;
import com.example.carrental.repository.RentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RentRepository rentRepository;

    public List<LocalDate> getUnavailableDates(Long carId) {
        List<Order> orders = orderRepository.findByCarIdAndStatus(carId, Order.OrderStatus.APPROVED);
        List<LocalDate> unavailableDates = new ArrayList<>();

        for (Order order : orders) {
            LocalDate date = order.getStartDate();
            while (!date.isAfter(order.getEndDate())) {
                unavailableDates.add(date);
                date = date.plusDays(1);
            }
        }

        return unavailableDates;
    }

    public void approveOrderAndCreateRent(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getStatus().equals(Order.OrderStatus.PENDING)) {
            throw new IllegalStateException("Order must be in PENDING status to approve.");
        }

        // Approve the order
        order.setStatus(Order.OrderStatus.APPROVED);
        orderRepository.save(order);

        // Create a new Rent
        Rent rent = new Rent();
        rent.setOrder(order);
        rent.setCar(order.getCar());
        rent.setCustomer(order.getCustomer());
        rent.setStartDate(order.getStartDate());
        rent.setEndDate(order.getEndDate());
        rent.setIncludeDriver(order.isIncludeDriver());
        rent.setDriverFee(order.getDriverFee());
        rent.setTotalPrice(order.getTotalPrice());
        rent.setRentStatus(Rent.RentStatus.NOT_STARTED);

        rentRepository.save(rent);
    }
}

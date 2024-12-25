package com.example.carrental.repository;

import com.example.carrental.entity.Order.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCarIdAndStatus(Long carId, Order.OrderStatus status);
    List<Order> findByStatus(Order.OrderStatus status);
}

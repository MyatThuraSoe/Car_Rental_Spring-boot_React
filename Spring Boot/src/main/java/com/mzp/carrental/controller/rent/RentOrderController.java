package com.mzp.carrental.controller.rent;

import com.mzp.carrental.dto.RentalOrderDTO;
import com.mzp.carrental.entity.Cars.Car;
import com.mzp.carrental.entity.Rent.RentalOrder;
import com.mzp.carrental.entity.Users.Customer;
import com.mzp.carrental.service.Customer.CustomerService;
import com.mzp.carrental.service.agency.CarService;
import com.mzp.carrental.service.rent.RentService;
import com.mzp.carrental.service.rent.RentalOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rent/orders")
public class RentOrderController {

    @Autowired
    private RentalOrderService rentalOrderService;

    //---------------------------------
    @Autowired
    private CarService carService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private RentService rentService;
    //------------------------------------------------------


    // Create a rental order
    @PostMapping
    public ResponseEntity<String> createOrder( @RequestBody RentalOrderDTO orderDto) {
        System.out.println("Received Order DTO: " + orderDto.toString());
        try {
            rentalOrderService.createRentalOrder(orderDto);
            return ResponseEntity.ok("Order successfully created!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error occurred.");
        }
    }



    // Update rental order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @RequestParam RentalOrder.OrderStatus status) {
        try {
            rentalOrderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok("Order status updated!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/{carId}/orders")
    public ResponseEntity<List<RentalOrderDTO>> getOrdersByCar(@PathVariable Long carId) {
        List<RentalOrderDTO> orders = rentalOrderService.getFilteredOrdersByCar(carId);
        return ResponseEntity.ok(orders);
    }


    // Cancel a rental order
    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> cancelOrder(@PathVariable Long orderId) {
        try {
            rentalOrderService.cancelRentalOrder(orderId);
            return ResponseEntity.ok("Order canceled successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }


    //------------------MTRS Code Start-------------



    // View rental orders for the current agency
    @GetMapping("/agency")
    public ResponseEntity<List<RentalOrder>> getOrdersByAgency() {
        Integer agencyId = carService.getCurrentAgency().getId();
        List<RentalOrder> orders = rentalOrderService.getOrdersByAgency(agencyId);
        return orders.isEmpty() ?
                ResponseEntity.noContent().build() :
                ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}/agency")
    public ResponseEntity<?> getOrderDetailsForAgency(@PathVariable Long id) {
        try {
            RentalOrder order = rentalOrderService.getRentalOrderById(id);
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
            }
            // Fetch car details and customer details here
            Car car = carService.getCarById(order.getCar().getId());
            Customer customer = customerService.getCustomerById(order.getCustomer().getId());

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("carId", car.getId());
            response.put("carImage", car.getImageData()); // Assuming you have a way to encode image to Base64 or URL
            response.put("carBrandModel", car.getBrand() + " " + car.getModel());
            response.put("customerId", customer.getId());
            response.put("customerName", customer.getUsername());
            response.put("startDate", order.getStartDate());
            response.put("endDate", order.getEndDate());
            response.put("pickUpLocation", order.getPickUpLocation());
            response.put("dropOffLocation", order.getDropOffLocation());
            response.put("includeDriver", order.isIncludeDriver());
            response.put("driverFeePerDay", car.getDriverFeePerDay());
            response.put("carPricePerDay", car.getPricePerDay());
            long totalRentDays = ChronoUnit.DAYS.between(order.getStartDate(), order.getEndDate()) + 1;
            response.put("totalRentDays", totalRentDays);
            double totalPrice = totalRentDays * (car.getPricePerDay() + (order.isIncludeDriver() ? car.getDriverFeePerDay() : 0));
            response.put("totalAmount", totalPrice);
            response.put("orderStatus", order.getStatus());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching order details");
        }
    }
    //------------------------------------- MTRS CODE END--------------------------

    @GetMapping("/customer")
    public ResponseEntity<List<RentalOrderDTO>> getOrdersByCustomer() {
        List<RentalOrderDTO> orders = rentalOrderService.getFilteredOrdersByCustomer();
        return ResponseEntity.ok(orders);
    }

}


package com.mzp.carrental.service.rent;

import com.mzp.carrental.dto.RentalOrderDTO;
import com.mzp.carrental.entity.Cars.Car;
import com.mzp.carrental.entity.OurUsers;
import com.mzp.carrental.entity.Rent.Rent;
import com.mzp.carrental.entity.Rent.RentalOrder;
import com.mzp.carrental.entity.Users.Customer;

import com.mzp.carrental.repository.Customer.CustomerRepo;
import com.mzp.carrental.repository.UsersRepo;
import com.mzp.carrental.repository.agency.CarRepo;
import com.mzp.carrental.repository.rent.RentRepo;
import com.mzp.carrental.repository.rent.RentalOrderRepo;
import com.mzp.carrental.service.OurUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RentalOrderService {

    @Autowired
    private RentalOrderRepo rentalOrderRepository;

    @Autowired
    private CarRepo carRepository;

    @Autowired
    private CustomerRepo customerRepository;

    @Autowired
    private RentRepo rentRepo;

    @Autowired
    private OurUserDetailsService userDetailsService;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private RentService rentService;

    // Create a rental order with backend total price verification
//    public void createRentalOrder(RentalOrderDTO orderDto) {
//        System.out.println("Processing Order DTO: " + orderDto);
//
//        // Fetch the car and customer entities from the database
//        Car car = carRepository.findById(orderDto.getCarId())
//                .orElseThrow(() -> new RuntimeException("Car not found"));
//        Customer customer = customerRepository.findById(orderDto.getCustomerId())
//                .orElseThrow(() -> new RuntimeException("Customer not found"));
//
//        // Calculate the number of days for the rental
//        long rentalDays = orderDto.getEndDate().toEpochDay() - orderDto.getStartDate().toEpochDay() + 1;
//
//        if (rentalDays <= 0) {
//            throw new RuntimeException("End date must be after the start date.");
//        }
//
//        // Calculate the backend total price
//        double backendTotalPrice = car.getPricePerDay() * rentalDays;
//        if (orderDto.isIncludeDriver()) {
//            backendTotalPrice += car.getDriverFeePerDay() * rentalDays;
//        }
//
//        // Compare backend-calculated total price with the frontend-provided total price
//        if (Math.abs(backendTotalPrice - orderDto.getTotalPrice()) > 0.01) { // Allowing minimal floating-point error
//            throw new RuntimeException("Data integrity issue: Total price mismatch.");
//        }
//
//        // Create and populate the RentalOrder entity
//        RentalOrder rentalOrder = new RentalOrder();
//        rentalOrder.setCar(car);
//        rentalOrder.setCustomer(customer);
//        rentalOrder.setStartDate(orderDto.getStartDate());
//        rentalOrder.setEndDate(orderDto.getEndDate());
//        rentalOrder.setPickUpLocation(orderDto.getPickUpLocation());
//        rentalOrder.setDropOffLocation(orderDto.getDropOffLocation());
//        rentalOrder.setIncludeDriver(orderDto.isIncludeDriver());
//        rentalOrder.setPricePerDay(car.getPricePerDay());
//        rentalOrder.setDriverFeePerDay(car.getDriverFeePerDay());
//        rentalOrder.setTotalPrice(backendTotalPrice); // Use backend-calculated total price
//        rentalOrder.setStatus(RentalOrder.OrderStatus.PENDING);
//
//        // Save the order to the database
//        rentalOrderRepository.save(rentalOrder);
//    }
    public void createRentalOrder(RentalOrderDTO orderDto) {
        System.out.println("Processing Order DTO: " + orderDto);

        // Fetch the car and customer entities from the database
        Car car = carRepository.findById(orderDto.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));
        Customer customer = customerRepository.findById(orderDto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));


        LocalDate today = LocalDate.now();
        LocalDate maxAllowedDate = today.plusDays(62);

        // Check if startDate and endDate are within 100 days from today
        if (orderDto.getStartDate().isBefore(today) || orderDto.getStartDate().isAfter(maxAllowedDate)) {
            throw new RuntimeException("Start date must be within 62 days from today.");
        }

        if (orderDto.getEndDate().isBefore(orderDto.getStartDate()) || orderDto.getEndDate().isAfter(maxAllowedDate)) {
            throw new RuntimeException("End date must be after the start date and within 62 days from today.");
        }
        // Calculate the number of days for the rental
        long rentalDays = orderDto.getEndDate().toEpochDay() - orderDto.getStartDate().toEpochDay() + 1;

        if (rentalDays <= 0) {
            throw new RuntimeException("End date must be after the start date.");
        }

        // Fetch unavailable dates for the car
        List<LocalDate> unavailableDates = rentService.getUnavailableDatesByCar(orderDto.getCarId());
        System.out.println("Unavailable dates for car: " + unavailableDates);

        // Check if any of the rental dates overlap with unavailable dates
        for (LocalDate date = orderDto.getStartDate(); !date.isAfter(orderDto.getEndDate()); date = date.plusDays(1)) {
            if (unavailableDates.contains(date)) {
                throw new RuntimeException("The selected dates overlap with an existing rental for this car.");
            }
        }

        // Calculate the backend total price
        double backendTotalPrice = car.getPricePerDay() * rentalDays;
        if (orderDto.isIncludeDriver()) {
            backendTotalPrice += car.getDriverFeePerDay() * rentalDays;
        }

        // Compare backend-calculated total price with the frontend-provided total price
        if (Math.abs(backendTotalPrice - orderDto.getTotalPrice()) > 0.01) { // Allowing minimal floating-point error
            throw new RuntimeException("Data integrity issue: Total price mismatch.");
        }

        // Create and populate the RentalOrder entity
        RentalOrder rentalOrder = new RentalOrder();
        rentalOrder.setCar(car);
        rentalOrder.setCustomer(customer);
        rentalOrder.setStartDate(orderDto.getStartDate());
        rentalOrder.setEndDate(orderDto.getEndDate());
        rentalOrder.setPickUpLocation(orderDto.getPickUpLocation());
        rentalOrder.setDropOffLocation(orderDto.getDropOffLocation());
        rentalOrder.setIncludeDriver(orderDto.isIncludeDriver());
        rentalOrder.setPricePerDay(car.getPricePerDay());
        rentalOrder.setDriverFeePerDay(car.getDriverFeePerDay());
        rentalOrder.setTotalPrice(backendTotalPrice); // Use backend-calculated total price
        rentalOrder.setStatus(RentalOrder.OrderStatus.PENDING);

        // Save the order to the database
        rentalOrderRepository.save(rentalOrder);
    }



//    // Get orders by customer
//    public List<RentalOrder> getOrdersByCustomer(Integer customerId) {
//        return rentalOrderRepository.findByCustomer_Id(customerId);
//    }

    public List<RentalOrderDTO> getFilteredOrdersByCar(Long carId) {
        List<RentalOrder> rentalOrders = rentalOrderRepository.findByCarId(carId);

        // Filter orders as needed (e.g., by status)
        List<RentalOrder> filteredOrders = rentalOrders.stream()
                .filter(order -> order.getStatus() != RentalOrder.OrderStatus.CANCEL) // Example: Exclude canceled orders
                .toList();

        // Debug: Print filtered orders
        filteredOrders.forEach(order -> System.out.println("Filtered Order: " + order));
        // Map to DTOs
        return filteredOrders.stream().map(this::mapToDTO).toList();

    }

    private RentalOrderDTO mapToDTO(RentalOrder rentalOrder) {
        RentalOrderDTO dto = new RentalOrderDTO();
        dto.setId(rentalOrder.getId());
        dto.setStatus(rentalOrder.getStatus());
        dto.setCarId(rentalOrder.getCar().getId());
        dto.setCustomerId(rentalOrder.getCustomer().getId());
        dto.setStartDate(rentalOrder.getStartDate());
        dto.setEndDate(rentalOrder.getEndDate());
        dto.setPickUpLocation(rentalOrder.getPickUpLocation());
        dto.setDropOffLocation(rentalOrder.getDropOffLocation());
        dto.setIncludeDriver(rentalOrder.isIncludeDriver());
        dto.setTotalPrice(rentalOrder.getTotalPrice());
        return dto;
    }

    @Transactional
    public void updateOrderStatus(Long orderId, RentalOrder.OrderStatus newStatus) {
        // Retrieve the RentalOrder by ID
        RentalOrder rentalOrder = rentalOrderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!rentalOrder.getStatus().equals(newStatus)) {
            rentalOrder.setStatus(newStatus);
            if (newStatus == RentalOrder.OrderStatus.APPROVED) {

                System.out.println("Checking overlap for Car ID: " + rentalOrder.getCar().getId());
                System.out.println("Start Date: " + rentalOrder.getStartDate());
                System.out.println("End Date: " + rentalOrder.getEndDate());
                System.out.println("Order ID: " + orderId);

                boolean hasOverlap = rentRepo.existsByCarIdAndStartDateBeforeAndEndDateAfter(
                        rentalOrder.getCar().getId(),
                        rentalOrder.getEndDate(),
                        rentalOrder.getStartDate()
                );

                System.out.println("Overlap Exists: " + hasOverlap);
                if (hasOverlap) {
                    throw new RuntimeException("The selected dates overlap with an existing rental for this car.");
                }


                createRent(rentalOrder);
            }
            else if (newStatus == RentalOrder.OrderStatus.DENIED) {
                deleteRentIfExist(rentalOrder);
            }

        }
        rentalOrderRepository.save(rentalOrder);

    }

    private void createRent(RentalOrder rentalOrder) {
        // Create a new Rent object for the RentalOrder
        Rent rent = new Rent();

        rent.setRentalOrder(rentalOrder);
        rent.setRentStatus(Rent.RentStatus.NOT_STARTED);
        rent.setStartDate(rentalOrder.getStartDate());
        rent.setEndDate(rentalOrder.getEndDate());
        rent.setCar(rentalOrder.getCar());
        rent.setCustomer(rentalOrder.getCustomer());
        rent.setIncludeDriver(rentalOrder.isIncludeDriver());
        rent.setDriverFee(rentalOrder.getDriverFeePerDay());
        rent.setTotalPrice(rentalOrder.getTotalPrice());

        // Save Rent
        rentRepo.save(rent);
    }

    // Cancel a rental order
    public void cancelRentalOrder(Long orderId) {
        RentalOrder order = rentalOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        rentalOrderRepository.delete(order);
    }
    private void deleteRentIfExist(RentalOrder rentalOrder) {
        // Check if a Rent entity exists for this RentalOrder
        Rent rent = rentRepo.findByRentalOrder(rentalOrder);
        if (rent != null) {
            // Delete the Rent entity
            rentRepo.delete(rent);
        }
    }

    public RentalOrder getRentalOrderById(Long id) {
        return rentalOrderRepository.findById(id).orElse(null);
    }


    public List<RentalOrder> getOrdersByAgency(Integer agencyId) {
        return rentalOrderRepository.findByAgencyId(agencyId);
    }

    public List<RentalOrderDTO> getFilteredOrdersByCustomer() {

        String email = userDetailsService.getCurrentUserEmail();
        System.out.println("Email in getCurrentCustomer is " + email);
        Optional<OurUsers> user = usersRepo.findByEmail(email);
        Integer customerId = user.get().getId();

        List<RentalOrder> rentalOrders = rentalOrderRepository.findByCustomerId(customerId);

        // Filter orders as needed (e.g., by status)
        List<RentalOrder> filteredOrders = rentalOrders.stream()
                .filter(order -> order.getStatus() != RentalOrder.OrderStatus.CANCEL) // Example: Exclude canceled orders
                .toList();

        // Debug: Print filtered orders
        filteredOrders.forEach(order -> System.out.println("Filtered Order: " + order));
        // Map to DTOs
        return filteredOrders.stream().map(this::mapToDTO).toList();

    }


}

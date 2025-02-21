
package com.mzp.carrental.service.rent;
import com.mzp.carrental.dto.RentDTO;
import com.mzp.carrental.dto.RentalOrderDTO;
import com.mzp.carrental.entity.OurUsers;
import com.mzp.carrental.entity.Rent.Rent;

import com.mzp.carrental.entity.Rent.RentalOrder;
import com.mzp.carrental.repository.UsersRepo;
import com.mzp.carrental.repository.rent.RentRepo;
import com.mzp.carrental.service.OurUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class RentService {

    @Autowired
    private RentRepo rentRepository;
    @Autowired
    private OurUserDetailsService userDetailsService;
    @Autowired
    private UsersRepo usersRepo;



    public Rent getRentById(Long id) {
        Optional<Rent> rent = rentRepository.findById(id);
        if (rent.isEmpty()) {
            throw new RuntimeException("Rent with ID " + id + " not found");
        }
        return rent.get();
    }

    public Rent saveRent(Rent rent) {
        return rentRepository.save(rent);
    }


    public List<RentDTO> getFilteredRentsByCar(Long carId) {
        List<Rent> rents = rentRepository.findByCarId(carId);



        // Debug: Print filtered orders
        rents.forEach(rent -> System.out.println("rents: " + rent));
        // Map to DTOs
        return rents.stream().map(this::mapToDTO).toList();

    }

    private RentDTO mapToDTO(Rent rent) {
        RentDTO dto = new RentDTO();
        dto.setId(rent.getId());
        dto.setRentStatus(rent.getRentStatus());
        dto.setCarId(rent.getCar().getId());
        dto.setCustomerId(rent.getCustomer().getId());
        dto.setStartDate(rent.getStartDate());
        dto.setEndDate(rent.getEndDate());

        dto.setPickUpLocation(rent.getRentalOrder().getPickUpLocation());
        dto.setDropOffLocation(rent.getRentalOrder().getDropOffLocation());
        dto.setIncludeDriver(rent.getRentalOrder().isIncludeDriver());
        dto.setTotalPrice(rent.getRentalOrder().getTotalPrice());

        dto.setCarBrand(rent.getCar().getBrand());
        dto.setCarModel(rent.getCar().getModel());
        dto.setIncludeDriver(rent.isIncludeDriver());
        dto.setTotalPrice(rent.getTotalPrice());
        System.out.println("Responded Rent DTO is ");
        System.out.println(dto.toString());
        return dto;
    }

    public void updateOrderStatus(Long id, Rent.RentStatus status) {
        Rent rent = rentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (!rent.getRentStatus().equals(status)) {
            rent.setRentStatus(status);
        }

        rentRepository.save(rent);
    }

    public List<RentDTO> getFilteredRentsByCustomer() {
        String email = userDetailsService.getCurrentUserEmail();
        System.out.println("Email in getCurrentCustomer is " + email);
        Optional<OurUsers> user = usersRepo.findByEmail(email);
        Integer customerId = user.get().getId();


        List<Rent> rents = rentRepository.findByCustomerId(customerId);



        // Debug: Print filtered orders
        rents.forEach(rent -> System.out.println("rents: " + rent));
        // Map to DTOs
        return rents.stream().map(this::mapToDTO).toList();
    }
    public List<RentDTO> getFilteredRentsByAgency() {
        String email = userDetailsService.getCurrentUserEmail();
        System.out.println("Email in getFilteredRentsByAgency is " + email);

        OurUsers user = usersRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Integer agencyId = user.getId();

        List<Rent> rents = rentRepository.findByAgencyId(agencyId);

        rents.forEach(rent -> System.out.println("Rent: " + rent));

        return rents.stream().map(this::mapToDTO).toList();
    }

    public List<LocalDate> getUnavailableDatesByCar(Long carId) {
        // Fetch and filter orders
        List<Rent> filteredRents = getFilteredRentsByCar(carId)
                .stream()
                .map(this::mapToEntity) // Map DTO back to entity if needed
                .toList();

        // Print fetched orders for debugging
        System.out.println("Fetched Orders for Car ID " + carId + ":");
        for (Rent rent : filteredRents) {
            System.out.println("Rent ID: " + rent.getId() + ", Start Date: " + rent.getStartDate() + ", End Date: " + rent.getEndDate());
        }

        // Calculate unavailable dates
        List<LocalDate> unavailableDates = filteredRents.stream()
                .flatMap(rent -> rent.getStartDate().datesUntil(rent.getEndDate().plusDays(1))) // Include end date
                .distinct()
                .collect(Collectors.toList());

        // Print unavailable dates for debugging
        System.out.println("Unavailable Dates for Car ID " + carId + ":");
        unavailableDates.forEach(System.out::println);

        return unavailableDates;
    }

    private Rent mapToEntity(RentDTO dto) {
        Rent entity = new Rent();
        entity.setId(dto.getId());
        entity.setRentStatus(dto.getRentStatus());
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setIncludeDriver(dto.isIncludeDriver());
        entity.setTotalPrice(dto.getTotalPrice());


        return entity;
    }
}


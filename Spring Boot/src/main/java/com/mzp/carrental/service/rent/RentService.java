
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

import java.util.List;
import java.util.Optional;


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

        dto.setIncludeDriver(rent.isIncludeDriver());
        dto.setTotalPrice(rent.getTotalPrice());
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
}


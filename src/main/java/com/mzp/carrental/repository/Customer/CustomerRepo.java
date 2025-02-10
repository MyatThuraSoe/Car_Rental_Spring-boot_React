package com.mzp.carrental.repository.Customer;

import com.mzp.carrental.entity.Users.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepo extends JpaRepository<Customer, Integer> {

    // Example custom query: Find a customer by username
    Optional<Customer> findByUsername(String username);

    Optional<Customer> findByOurUsers_Email(String email);

}

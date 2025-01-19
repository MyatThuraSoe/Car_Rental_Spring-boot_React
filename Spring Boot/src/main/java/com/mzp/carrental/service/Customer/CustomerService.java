package com.mzp.carrental.service.Customer;

import com.mzp.carrental.entity.Users.Customer;
import com.mzp.carrental.repository.Customer.CustomerRepo;
import com.mzp.carrental.service.OurUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private OurUserDetailsService userDetailsService;

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepo.findAll();
    }

    // Get a customer by ID
    public Customer getCustomerById(Integer id) {
        return customerRepo.findById(id).orElse(null);
    }

    // Create a new customer
    public Customer createCustomer(Customer customer) {
        return customerRepo.save(customer);
    }

    // Update an existing customer
    public Customer updateCustomer(Integer id, Customer customerDetails) {
        return customerRepo.findById(id)
                .map(existingCustomer -> {
                    existingCustomer.setUsername(customerDetails.getUsername());
                    existingCustomer.setPhoneNumber(customerDetails.getPhoneNumber());
                    existingCustomer.setCity(customerDetails.getCity());
                    existingCustomer.setDrivingLiscene(customerDetails.getDrivingLiscene());
                    return customerRepo.save(existingCustomer);
                }).orElse(null);
    }

    // Delete a customer
    public boolean deleteCustomer(Integer id) {
        if (customerRepo.existsById(id)) {
            customerRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Customer getLoggedInCustomer() {
        String email = userDetailsService.getCurrentUserEmail();
        return customerRepo.findByOurUsers_Email(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
}

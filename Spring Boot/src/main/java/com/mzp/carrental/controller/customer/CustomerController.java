package com.mzp.carrental.controller.customer;

import com.mzp.carrental.entity.Users.Customer;
import com.mzp.carrental.service.Customer.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Get all customers
    @GetMapping
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return customers.isEmpty()
                ? ResponseEntity.status(HttpStatus.NO_CONTENT).build()
                : ResponseEntity.ok(customers);
    }

    // Get a specific customer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Integer id) {
        Customer customer = customerService.getCustomerById(id);
        return customer != null
                ? ResponseEntity.ok(customer)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Create a new customer
    @PostMapping
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer) {
        Customer createdCustomer = customerService.createCustomer(customer);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
    }

    // Update an existing customer
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Integer id, @RequestBody Customer customer) {
        Customer updatedCustomer = customerService.updateCustomer(id, customer);
        return updatedCustomer != null
                ? ResponseEntity.ok(updatedCustomer)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Delete a customer
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        boolean isDeleted = customerService.deleteCustomer(id);
        return isDeleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}

package com.mzp.carrental.controller;

import com.mzp.carrental.entity.OurUsers;
import com.mzp.carrental.entity.Users.Agency;
import com.mzp.carrental.entity.Users.Customer;
import com.mzp.carrental.repository.UsersRepo;
import com.mzp.carrental.repository.agency.AgencyRepo;
import com.mzp.carrental.repository.Customer.CustomerRepo;
import com.mzp.carrental.service.JWTUtils;
import com.mzp.carrental.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private AgencyRepo agencyRepo;

    @Autowired
    private CustomerRepo customerRepo;

    // 🔴 EXISTING: Agency Notifications
    @GetMapping("/agency/notifications/{agencyId}")
    public SseEmitter streamAgencyNotifications(@PathVariable Integer agencyId, @RequestParam("token") String token) {
//        System.out.println("🔍 Received SSE request for agencyId: " + agencyId);
//        System.out.println("🔍 Received JWT Token: " + token);

        // Extract email & role from JWT
        String email = jwtUtils.extractUsername(token);
        String userRole = jwtUtils.extractUserRole(token);

//        System.out.println("✅ Extracted Email: " + email);
//        System.out.println("✅ Extracted Role: " + userRole);

        if (!"Agency".equals(userRole)) {
//            System.out.println("❌ User is not an agency: " + email);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only agencies can access notifications");
        }

        // Validate agency
        Agency agency = agencyRepo.findByOurUsers_Email(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "No agency found for user"));

        if (!agency.getId().equals(agencyId)) {
//            System.out.println("❌ Mismatch: Request agencyId = " + agencyId + " but DB agencyId = " + agency.getId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: Wrong Agency ID");
        }

//        System.out.println("✅ Successfully connected to SSE for agency ID: " + agencyId);
        return notificationService.createEmitter(agencyId);
    }

    // ✅ NEW: Customer Notifications
    @GetMapping("/customer/notifications/{customerId}")
    public SseEmitter streamCustomerNotifications(@PathVariable Integer customerId, @RequestParam("token") String token) {
//        System.out.println("🔍 Received SSE request for customerId: " + customerId);
//        System.out.println("🔍 Received JWT Token: " + token);

        // Extract email & role from JWT
        String email = jwtUtils.extractUsername(token);
        String userRole = jwtUtils.extractUserRole(token);

//        System.out.println("✅ Extracted Email: " + email);
//        System.out.println("✅ Extracted Role: " + userRole);

        if (!"Customer".equals(userRole)) {
//            System.out.println("❌ User is not a customer: " + email);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only customers can access notifications");
        }

        // Validate customer
        Customer customer = customerRepo.findByOurUsers_Email(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "No customer found for user"));

        if (!customer.getId().equals(customerId)) {
//            System.out.println("❌ Mismatch: Request customerId = " + customerId + " but DB customerId = " + customer.getId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: Wrong Customer ID");
        }

//        System.out.println("✅ Successfully connected to SSE for customer ID: " + customerId);
        return notificationService.createCustomerEmitter(customerId);
    }
}

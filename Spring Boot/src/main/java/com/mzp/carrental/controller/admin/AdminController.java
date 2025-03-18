package com.mzp.carrental.controller.admin;

import com.mzp.carrental.service.admin.AdminService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public List<Map<String, Object>> getAgencyStats() {
        return adminService.getAgencyStats();
    }

    // api for customer list to verify add pagination to 10, add verification status of pending as param

    // api for agency list to verify add pagination to 10, add verification status of pending as param



}
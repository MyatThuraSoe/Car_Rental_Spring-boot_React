package com.mzp.carrental.controller;

import com.mzp.carrental.service.agency.AgencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/view/agencies")
public class AgencyViewController {

    @Autowired
    private AgencyService agencyService;

    /**
     * Endpoint to fetch the profile image of an agency by its ID.
     *
     * @param id The ID of the agency.
     * @return ResponseEntity containing the image data or NOT_FOUND if no image exists.
     */
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getAgencyImage(@PathVariable Integer id) {
        // Fetch the agency image from the service
        byte[] imageData = agencyService.getAgencyImageById(id);

        if (imageData != null) {
            // Retrieve the image type (e.g., "image/jpeg") from the service
            String imageType = agencyService.getAgencyImageTypeById(id);

            // Return the image with the appropriate content type
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(imageType)) // Dynamically set content type
                    .body(imageData);
        }

        // If no image is found, return a 404 NOT_FOUND response
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
package com.mzp.carrental.service.agency;


import com.mzp.carrental.dto.AgencyDTO;
import com.mzp.carrental.entity.Users.Agency;
import com.mzp.carrental.repository.agency.AgencyRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgencyService {

    @Autowired
    private AgencyRepo agencyRepo;

    public List<Agency> getAllAgencies() {
        return agencyRepo.findAll();
    }

    public Agency getAgencyById(Integer id) {
        return agencyRepo.findById(id).orElse(null);
    }

    public Agency createAgency(Agency agency) {
        return agencyRepo.save(agency);
    }

    public Agency updateAgency(Integer id, Agency agencyDetails) {
        return agencyRepo.findById(id).map(existingAgency -> {
            existingAgency.setUsername(agencyDetails.getUsername());
            existingAgency.setPhoneNumber(agencyDetails.getPhoneNumber());
            existingAgency.setAddress(agencyDetails.getAddress());
            existingAgency.setCity(agencyDetails.getCity());
            return agencyRepo.save(existingAgency);
        }).orElse(null);
    }

    public boolean deleteAgency(Integer id) {
        if (agencyRepo.existsById(id)) {
            agencyRepo.deleteById(id);
            return true;
        }
        return false;
    }

}

package com.mzp.carrental.repository.agency;


import com.mzp.carrental.entity.Users.Agency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgencyRepo extends JpaRepository<Agency, Integer> {

    // Find an agency by the email of the associated user
    Optional<Agency> findByOurUsers_Email(String email);
}

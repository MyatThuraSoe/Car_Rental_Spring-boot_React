package com.mzp.carrental.repository.agency;


import com.mzp.carrental.entity.Users.Agency;
import com.mzp.carrental.entity.Users.Customer;
import com.mzp.carrental.entity.Verification.AgencyVerification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgencyRepo extends JpaRepository<Agency, Integer> {

    // Find an agency by the email of the associated user
    Optional<Agency> findByOurUsers_Email(String email);

    // Below quary for deleting a user
    Optional<Agency> findByOurUsersId(Integer userId);

    // ✅ Fetch agencies by verification status
    Page<Agency> findByVerificationStatus(AgencyVerification.VerificationStatus status, Pageable pageable);
}

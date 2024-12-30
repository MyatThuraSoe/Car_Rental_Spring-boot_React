package com.mzp.carrental.entity.Users;

import com.mzp.carrental.entity.OurUsers;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;


    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ourusers_id", nullable = false)
    private OurUsers ourUsers;

    @Column(nullable = false, unique = true)
    private String drivingLiscene;

    @Column(nullable = false)
    private String phoneNumber;


    @Column(nullable = false)
    private String city;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }


    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDrivingLiscene() {
        return drivingLiscene;
    }

    public void setDrivingLiscene(String drivingLiscene) {
        this.drivingLiscene = drivingLiscene;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", drivingLiscene='" + drivingLiscene + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", city='" + city + '\'' +
                '}';
    }
}
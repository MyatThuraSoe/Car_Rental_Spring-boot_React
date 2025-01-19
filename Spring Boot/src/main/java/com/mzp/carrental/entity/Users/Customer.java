package com.mzp.carrental.entity.Users;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mzp.carrental.entity.OurUsers;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
@Data
public class Customer {
    @Id
    private Integer id;

    @Column(nullable = true, unique = true)
    private String username;


    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId // This maps the id of Agency to the id of OurUsers
    @JoinColumn(name = "ourusers_id", nullable = false)
    @JsonIgnore
    private OurUsers ourUsers;

    @Column(nullable = true, unique = true)
    private String drivingLiscene;

    @Column(nullable = true)
    private String phoneNumber;


    @Column(nullable = true)
    private String city;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    // Add this method if it's not already present
    public void setOurUsers(OurUsers ourUsers) {
        this.ourUsers = ourUsers;
    }

    public OurUsers getOurUsers() {
        return ourUsers;
    }
}
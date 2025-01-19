package com.mzp.carrental.entity.Users;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mzp.carrental.entity.Cars.Car;
import com.mzp.carrental.entity.OurUsers;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Entity
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Agency {
    @Id
    private Integer id; // Change this to Integer to match OurUsers ID type

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId // This maps the id of Agency to the id of OurUsers
    @JoinColumn(name = "ourusers_id", nullable = false)
    @JsonIgnore
    private OurUsers ourUsers;


    @Column(nullable = true)
    private String username;

    @Column(nullable = true)
    private String phoneNumber;

    @Column(nullable = true)
    private String address;

    @Column(nullable = true)
    private String city;

    @OneToMany(mappedBy = "agency", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // To handle JSON serialization properly
    private List<Car> cars;


    // getter and setter

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public List<Car> getCars() {
        return cars;
    }

    public void setCars(List<Car> cars) {
        this.cars = cars;
    }



    @Override
    public String toString() {
        return "Agency{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", address='" + address + '\'' +
                ", city='" + city + '\'' +
                '}'; // Excluding 'cars' to prevent recursion
    }


    public OurUsers getOurUsers() {
        return ourUsers;
    }

    public void setOurUsers(OurUsers ourUsers) {
        this.ourUsers = ourUsers;
    }

}
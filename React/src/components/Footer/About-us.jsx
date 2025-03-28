import React from "react";
import "./About-us.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Us</h1>
        <p>Learn more about our mission, values, and team!</p>
      </div>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Car Rentals, our mission is to provide affordable, reliable, and
            high-quality car rental services to individuals and businesses
            around the world. We aim to make your travel experience seamless
            with easy online booking and a wide selection of vehicles.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li>Customer Satisfaction: We put our customers first.</li>
            <li>Integrity: We believe in honesty and transparency.</li>
            <li>
              Innovation: We embrace new ideas and technology to improve
              services.
            </li>
            <li>Sustainability: We are committed to eco-friendly practices.</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Meet Our Team</h2>
          <div className="team">
            <div className="team-member">
              <img
                src="/about-us/selfie.webp"
                alt="John Doe"
                className="team-img"
              />
              <h3>Zaw Htet Aung</h3>
              <p>Front-end developer</p>

              <h3>Phyoe Thet Htun</h3>
              <p>Back-end developer</p>

              <h3>Myat Thura Soe</h3>
              <p>Full stack developer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

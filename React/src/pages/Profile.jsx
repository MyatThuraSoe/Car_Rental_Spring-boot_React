import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { authData } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    console.log(`URL gonna be /${authData.role?.toLowerCase()}/${authData.user?.id}`);
    const loadProfile = async () => {
      try {
        const response = await axiosInstance.get(`/${authData.role?.toLowerCase()}/${authData.user?.id}`);
        setDetails(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [authData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>{authData.role} Profile</h1>
      {authData.role === "Agency" && details && (
        <>
          <div>Email: {authData.user.email || "N/A"}</div>
          <div>Username: {details.username || "N/A"}</div>
          <div>Phone: {details.phoneNumber || "N/A"}</div>
          <div>Address: {details.address || "N/A"}</div>
          <div>City: {details.city || "N/A"}</div>
          <div>Cars Managed: {details.cars?.length || 0}</div>
          <Link to="/agency/profile-update" className="btn btn-primary">Update Profile Details</Link>
        </>
      )}
      {authData.role === "Customer" && details && (
        <>
          <div>Email: {authData.user.email || "N/A"}</div>
          <div>Username: {details.username || "N/A"}</div>
          <div>Phone: {details.phoneNumber || "N/A"}</div>
          <div>City: {details.city || "N/A"}</div>
          <div>Driving License: {details.drivingLiscene || "N/A"}</div>
          <Link to="/customer/profile-update" className="btn btn-primary">Update Profile Data</Link>
        </>
      )}
      
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { authData } = useAuth();
  const [details, setDetails] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authData?.role || !authData?.user?.id) {
      setError("User information is missing.");
      setLoading(false);
      return;
    }

    const rolePath = authData.role.toLowerCase();
    console.log(`Fetching profile from: /${rolePath}/${authData.user.id}`);

    const loadProfile = async () => {
      try {
        // Fetch profile details
        const response = await axiosInstance.get(`/${rolePath}/${authData.user.id}`);
        setDetails(response.data);
        console.log("Profile Data:", response.data);

        // Fetch profile image if available
        if (response.data.imageName) {
          console.log("Fetching Profile Image...");
          const imageResponse = await axiosInstance.get(
            `/view/${rolePath === "agency" ? "agencies" : "customers"}/${authData.user.id}/image`,
            { responseType: "blob" }
          );
          console.log(imageResponse.data)
          setProfileImage(URL.createObjectURL(imageResponse.data));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const profileDetails = details && (
    <>
      <div><strong>Email:</strong> {authData?.user?.email || "N/A"}</div>
      <div><strong>Username:</strong> {details.username || "N/A"}</div>
      <div><strong>Phone:</strong> {details.phoneNumber || "N/A"}</div>
      <div><strong>City:</strong> {details.city || "N/A"}</div>
      {authData.role === "Agency" && (
        <>
          <div><strong>Address:</strong> {details.address || "N/A"}</div>
          <div><strong>Cars Managed:</strong> {details.cars?.length || 0}</div>
          <Link to="/agency/profile-update" className="btn btn-primary">Update Profile</Link>
        </>
      )}
      {authData.role === "Customer" && (
        <>
          <div><strong>Driving License:</strong> {details.drivingLiscene || "N/A"}</div>
          <Link to="/customer/profile-update" className="btn btn-primary">Update Profile</Link>
        </>
      )}
    </>
  );

  return (
    <div className="container">
      <h1>{authData.role} Profile</h1>

      {/* Profile Image */}
      <div className="profile-img-container">
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="profile-img"  />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      
      {/* <div className="profile-img-container">
       
          <img src={ profileImage || "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"} alt="Profile" className="profile-img"  />
      </div> */}

      {/* Profile Details */}
      {profileDetails}

      <style>
        {`
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          h1 {
            font-weight: bold;
            color: #2c3e50;
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .profile-img-container {
            text-align: center;
            margin-bottom: 20px;
          }

          .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #007bff;
          }

          .no-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ccc;
            color: #555;
          }

          div {
            font-size: 1rem;
            margin-bottom: 1rem;
            color: #555;
          }

          .btn {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            text-decoration: none;
            transition: background-color 0.3s ease-in-out;
          }

          .btn-primary {
            background-color: #007bff;
            border: none;
            color: #fff;
          }

          .btn-primary:hover {
            background-color: #0056b3;
          }

          @media (max-width: 768px) {
            .container {
              padding: 15px;
            }
            div {
              font-size: 0.9rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {  useNavigate } from "react-router-dom";


const UpdateProfile = () => {
    const { authData } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        city: "",
        phoneNumber: "",
        address: "",
        drivingLiscene: ""
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axiosInstance.get(`/${authData.role.toLowerCase()}/${authData.user.id}`);
           
                setFormData({
                    username: data.username || "",
                    city: data.city || "",
                    phoneNumber: data.phoneNumber || "",
                    address: data.address || "",
                    drivingLiscene: data.drivingLiscene
                });
                if (data.imageName) {
                    const imageResponse = await axiosInstance.get(
                        `/view/${authData.role.toLowerCase() === "agency" ? "agencies" : "customers"}/${authData.user.id}/image`,
                        { responseType: "blob" }
                    );
                    setPreviewImage(URL.createObjectURL(imageResponse.data));
                }
            } catch (err) {
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [authData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            setImageFile(selectedImage);
            setPreviewImage(URL.createObjectURL(selectedImage));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
        if (imageFile) formDataToSend.append("image", imageFile);

        try {
            await axiosInstance.put(`/${authData.role.toLowerCase()}/${authData.user.id}`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccess("Profile updated successfully!");
            setTimeout(() => navigate(`/${authData.role.toLowerCase()}/profile`), 2000);
        } catch (err) {
            setError("Failed to update profile.");
        }
    };

    return (
        <div className="container">
            <h1>Update {authData.role} Profile</h1>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ID: {authData.user.id}</label>
                </div>
                <div>
                    <label>Username</label>
                    <input name="username" value={formData.username} onChange={handleChange} className="form-control" required />
                </div>
                
                <div>
                    <label>Phone</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-control" />
                </div>
                <div>
                    <label>City</label>
                    <input name="city" value={formData.city} onChange={handleChange} className="form-control" required />
                </div>
                {authData.role.toLowerCase() == "agency" &&
                <div>
                    <label>Address</label>
                    <input name="address" value={formData.address} onChange={handleChange} className="form-control" />
                </div>
                }

                {authData.role.toLowerCase() == "customer" &&
                <div>
                    <label>Driving Liscene</label>
                    <input name="drivingLiscene" value={formData.drivingLiscene} onChange={handleChange} className="form-control" />
                </div>

                }
                <div>
                    <label>Profile Image</label>
                    <input type="file" onChange={handleImageChange} className="form-control" />
                    {previewImage && <img src={previewImage} alt="Preview" style={{ width: "100px", marginTop: "10px" }} />}
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
        </div>
    );
};

export default UpdateProfile;
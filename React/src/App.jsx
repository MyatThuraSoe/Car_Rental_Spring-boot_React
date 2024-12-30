import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import AgencyLogin from "./pages/AgencyLogin";
import AgencyRegister from "./pages/AgencyRegister";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import AddCar from "./pages/AddCar";
import ViewCars from "./pages/ViewCars";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        <Route path="/agency/login" element={<AgencyLogin />} />
                        <Route path="/agency/register" element={<AgencyRegister />} />
                        <Route path="/user/login" element={<UserLogin />} />
                        <Route path="/user/register" element={<UserRegister />} />
                        <Route path="/agency/add-car" element={<AddCar />} />
                        <Route path="/view/cars" element={<ViewCars />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

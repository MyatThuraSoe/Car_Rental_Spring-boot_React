import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/NavBar/Navbar";
import Footer from "./components/Footer/Footer";
import AgencyLogin from "./pages/AgencyLogin";
import AgencyRegister from "./pages/AgencyRegister";
import CustomerRegister from "./pages/CustomerRegister";
import CustomerLogin from "./pages/CustomerLogin";
import AddCar from "./pages/AddCar";
import ViewCars from "./pages/ViewCars";
import ViewTestCar from "./pages/ViewTestCar";
import AgencyCars from "./pages/AgencyCars";
import UpdateCarForm from "./pages/UpdateCarForm";
import CarDetails from "./pages/CarDetails";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/UpdateProfile";
import LoginForm from "./components/LoginForm";
import OrdersManagement from './pages/OrdersManagement';
import RentsManagement from './pages/RentsManagement';
import AgencyRentalOrdersList from "./pages/AgencyRentOrderList";
import Home from './pages/Home/Home';
import CarList from './pages/Cars/CarList';
import Services from "./pages/Services/Services";
import ContactUs from "./pages/ContactUs/ContactUs";
import MyAccount from "./pages/My Account/MyAccount";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container mt-4">
                    <Routes>
                        {/* Agency Routes */}
                        <Route path="/agency/login" element={<AgencyLogin />} />
                        <Route path="/agency/register" element={<AgencyRegister />} />
                        <Route path="/agency/add-car" element={<AddCar />} />
                        <Route path="/agency/cars" element={<AgencyCars />} />
                        <Route path="/agency/cars/:id/edit" element={<UpdateCarForm />} />
                        <Route path="/agency/profile" element={<Profile />} />
                        <Route path='/agency/profile-update' element={<UpdateProfile />} />
                        <Route path='/agency/rent/orders' element={<AgencyRentalOrdersList />} />
                        <Route path="/agency/cars/:id/orders" element={<OrdersManagement />} />
                        <Route path="/agency/cars/:id/rents" element={<RentsManagement />} />

                        {/* Customer Routes */}
                        <Route path="/customer/login" element={<CustomerLogin />} />
                        <Route path="/customer/register" element={<CustomerRegister />} />
                        <Route path="/customer/profile" element={<Profile />} />
                        <Route path='/customer/profile-update' element={<UpdateProfile />} />
                        <Route path="/customer/cars/orders" element={<OrdersManagement />} />
                        <Route path="/customer/cars/rents" element={<RentsManagement />} />

                        {/* Public Routes */}
                        <Route path="/" element={<Home/>}/> 
                        <Route path="/browse" element={<ViewCars />} />
                        <Route path="/cars/:id" element={<CarDetails />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/cars" element={<CarList/>} />
                        <Route path="/services" element={<Services/>} />
                        <Route path="/contactus" element={<ContactUs/>} />
                        <Route path="/account" element={<MyAccount/>}/>
                        
                        
                        {/* Uncomment when Home component is ready */}
                        {/* <Route path="/cars/:id/order" element={<CarOrderForm />} /> */}

                    </Routes>
                </div>
                <Footer/>
            </Router>
        </AuthProvider>
    );
}

export default App;
// import axios from "axios";

// const axiosInstance = axios.create({
//     baseURL: "http://localhost:8000", // Adjust backend URL
// });

// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });



// export default axiosInstance;

import axios from "axios";

let sessionExpired = false; 

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000", // Adjust backend URL
});

// Request Interceptor: Add token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


// Response Interceptor: Handle expired token or no permission
// axiosInstance.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response?.status === 403) {
//             if (!sessionExpired) { // Check if alert has been shown
//                 sessionExpired = true;
//                 alert("⚠️ Session expired. Please log in again.");
//                 localStorage.removeItem("token");
//                 window.location.href = "/account"; // Redirect only once
//             }
//         }
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;
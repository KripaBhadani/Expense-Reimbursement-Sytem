import React, { useState } from "react";
import '../styles/login.css';
// import api from "../Dashboards/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // const { data } = await api.post("/auth/login", { email, password });

            // Post login data to the backend
            const { data } = await axiosInstance.post("/auth/login", { email, password });

            // console.log("Login API response:", data);

            // if (!data.token) {
            //     alert("Session expired. Please login again.");
            //     return;
            // }

            // Save the token to localStorage
            localStorage.setItem("token", data.token); 

            // Decode the token to extract the user role
            const decoded = jwtDecode(data.token); 
            localStorage.setItem("role", decoded.role);

            alert("Login successful");

            // Redirect to the user's specific dashboard based on their role
            navigate(data.redirectTo); // This will use the redirect URL from the response

        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong. Please try again later.";
            alert(`Error: ${message}`);
        } finally {
            setIsLoading(false); // Re-enable button
        }
    };

    return (
        <div className="login-page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;

// import React, { useState } from "react";
// import '../styles/login.css';
// import api from "../Dashboards/api";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         try {
//             const { data } = await api.post("/auth/login", { email, password });

//             console.log("Login API response:", data);

//             if (!data.token) {
//                 alert("Session expired. Please login again.");
//                 return;
//             }

//             localStorage.setItem("token", data.token); 
//             const decoded = jwtDecode(data.token);
//             localStorage.setItem("role", decoded.role);
//             alert("Login successful");

//             // setUserRole(decoded.role); // You may need to pass `setUserRole` as a prop.
//             navigate(`dashboard/${decoded.role}`);

//             // window.location.reload();
            
//             // console.log("Decoded role:", decoded.role);
//             // console.log("Decoded JWT:", jwtDecode(data.token));

            
//             // console.log("Navigating to dashboard:", decoded.role);

//             //Redirect based on role
//             // if (decoded.role === "employee") navigate("/dashboard/employee");
//             // else if (decoded.role === "manager") navigate("/dashboard/manager");
//             // else if (decoded.role === "finance") navigate("/dashboard/finance");
//             // else navigate("/");
//         } catch (error) {
//             const message = error.response?.data?.message || "Something went wrong. Please try again later.";
//             alert(`Error: ${message}`);
//         } finally {
//             setIsLoading(false); // Re-enable button
//         }
//     };

//     return (
//         <div className="login-page">
//             <h2>Login</h2>
//             <form onSubmit={handleSubmit} className="form">
//                 <div className="form-group">
//                     <label>Email</label>
//                     <input
//                         type="email"
//                         className="form-control"
//                         placeholder="Enter your email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Password</label>
//                     <input
//                         type="password"
//                         className="form-control"
//                         placeholder="Enter your password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit" className="btn" disabled={isLoading}>
//                     {isLoading ? "Logging in..." : "Login"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Login;

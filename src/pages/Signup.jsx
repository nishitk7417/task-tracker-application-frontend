import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader"; // adjust the path as needed

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: ""
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // loader state
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // show loader

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/users/register`, formData, {
        withCredentials: true
      });

      if (response.status === 201) {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => {
          setIsLoading(false); // hide loader
          navigate("/login");
        }, 1000);
      } else {
        setMessage("Signup failed.");
        setIsLoading(false); // hide loader
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Something went wrong.");
      setIsLoading(false); // hide loader
    }
  };

  return (
    <div className="min-h-screen w-[100vw] flex items-center justify-center bg-gray-300 text-black">
      {isLoading && <Loader />} {/* Conditionally render Loader */}
      <div className="w-full max-w-md p-8 mx-4 space-y-4 flex flex-col items-center bg-gray-400 rounded shadow-md">
        <Link to="/" className="">
          <svg className='w-6 fill-gray-600' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>
        </Link>
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
        {message && <p className="text-center text-sm text-gray-700">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none" required />
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none" required />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 py-2 rounded text-white font-semibold">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-gray-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

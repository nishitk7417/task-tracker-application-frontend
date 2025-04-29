import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initial, setInitial] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); // for outside click
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));

    setIsLoggedIn(!!token);

    if (userData && userData.name) {
      setInitial(userData.name.charAt(0).toUpperCase());
    }
  }, []);

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate("/");
    setShowDropdown(false);
  };

  const navLinks = (
    <div className='flex justify-between items-center'>
      {!isLoggedIn ? (
        <>
          <li>
            <Link to="/signup" className='mr-4'>Signup</Link>
          </li>
          <li>
            <Link to="/login" className='px-3 py-2 bg-white text-black rounded-[3rem] hover:bg-gray-300'>Login</Link>
          </li>
        </>
      ) : (
        <li className="relative" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-14 h-10 flex justify-center items-center cursor-pointer rounded-full bg-gray-400 text-white font-bold hover:border"
          >
            {initial}
            <svg className="w-4 h-4 text-white ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-36 bg-gray-400 rounded-md shadow-lg z-50">
            <span
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-gray-200 cursor-pointer hover:bg-red-400 hover:text-white hover:border hover:border-white"
            >
              Logout
            </span>
          </div>
          )}
        </li>
      )}
    </div>
  );

  return (
    <nav className="bg-gradient-to-r from-gray-700 fixed to-black w-[100vw] text-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Part */}
        <div className='flex items-center space-x-5'>
          <Link to="/" className="text-2xl font-bold flex text-gray-400">Task Tracker</Link>
        </div>
        <ul className="font-medium">
          {navLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
// import React, {useState} from "react";
// import { Link,useNavigate } from "react-router-dom";

// export default function Navbar() {
//     const [isActive, setActive] = useState(false);
//     const userToken = localStorage.getItem("authToken");
//     const navigate = useNavigate();

//     const handleClick = () => {
//         setActive((isActive) => !isActive)
//     }
//     const handleLogout = async() => {
//           try {
//               const response = await fetch('http://localhost:8080/api/auth/logout', {
//                   method: 'POST',
//                   // credentials: 'include',
//                   headers: {
//                   'Content-Type': 'application/json',
//                   "Authorization": `Bearer ${userToken}`
//                   },
//               });
//               if(response.ok){
//                   console.log("Logout successful...")
//                   navigate("/")
//               } else {console.log("Logout failed...")}
//           } catch(error) {console.log(error) }
      
//   }
//   return (
//   <>
//     <div className="navbar">
//         <Link to="/dashboard" className="titleNavbar">Momentum</Link>
//         <a href="#" className="toggleButton" onClick={handleClick}>
//             <span className="toggleBar"></span>
//             <span className="toggleBar"></span>
//             <span className="toggleBar"></span>
//         </a>
//         <div className={`navbarLinks ${isActive ? 'active' : ''}`}>
//             <ul>
//               <li> <Link to="/dashboard" className="summary">Summary</Link></li>
//               <li> <Link to="/api/todos/progress" className="progressNav">Progress</Link> </li>
//               <li> <Link to="/calendar" className="progressNav">Calendar</Link> </li>
//               <li> <a className="progressNav" onClick={handleLogout}>Logout</a> </li>
//             </ul>
//         </div>
//     </div>  
//     </>
//   )
// }
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isActive, setActive] = useState(false);
  const userToken = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  const handleClick = () => {
    setActive((isActive) => !isActive);
  };

  const handleLinkClick = () => {
    setActive(false);
  }

  const handleLogout = async() => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                // credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${userToken}`
                },
            });
            if(response.ok){
                console.log("Logout successful...")
                navigate("/")
            } else {console.log("Logout failed...")}
        } catch(error) {console.log(error) }
      
  }

  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="navbar" ref={navbarRef}>
        <Link to="/dashboard" className="titleNavbar" onClick={handleLinkClick}>
          Momentum
        </Link>
        <a href="#" className="toggleButton" onClick={handleClick}>
          <span className="toggleBar"></span>
          <span className="toggleBar"></span>
          <span className="toggleBar"></span>
        </a>
        <div className={`navbarLinks ${isActive ? 'active' : ''}`}>
             <ul>
               <li> <Link to="/dashboard" className="summary" onClick={handleLinkClick}>Summary</Link></li>
               <li> <Link to="/calendar" className="progressNav" onClick={handleLinkClick}>Calendar</Link> </li>
               <li> <a className="progressNav" onClick={handleLogout}>Logout</a> </li>
             </ul>
         </div>
      </div>
    </>
  );
};

export default Navbar;

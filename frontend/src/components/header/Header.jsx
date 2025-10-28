import React from 'react'
import './header.css'; 
import { Link } from 'react-router-dom';

const Header = ({isAuth}) => {
  return (
    <header>
    <div className="logo"> Tutorial Platform</div>

    <div className="link">
     <Link to ={"/"}>Home</Link>
     <Link to ={"/about"}>About</Link>
     <Link to ={"/courses"}>Courses</Link>
     {
      isAuth?(
        <Link to ={"/account"}>Account</Link>
      ):(
        <Link to ={"/login"}>Login</Link>
      )
     }
    </div> 

    </header>
  )
}

export default Header
import React from 'react';
import './common.css';
import { Link } from 'react-router-dom';
import { IoIosHome } from "react-icons/io";
import { FaBookOpen, FaUserAlt } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { AiOutlineLogout } from 'react-icons/ai';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <ul>
        <li>
          <Link to={'/admin/dashboard'}>
              <div className='icon'>
                  <IoIosHome size={20}/>
              </div>
              <span>Home</span>
          </Link>
        </li>

        <li>
          <Link to={'/admin/course'}>
              <div className='icon'>
                  <FaBookOpen size={20}/>
              </div>
              <span>Course</span>
          </Link>
        </li>
        
        <li>
          <Link to={'/admin/users'}>
              <div className='icon'>
                  <FaUserAlt size={20}/>
              </div>
              <span>Users</span>
          </Link>
        </li>

        <li>
          <Link to={'/admin/payments'}>
              <div className='icon'>
                  <AiOutlineDollarCircle size={20}/>
              </div>
              <span>Payments</span>
          </Link>
        </li>
        

        <li>
          <Link to={'/account'}>
              <div className='icon'>
                  <AiOutlineLogout size={20}/>
              </div>
              <span>Logout</span>
          </Link>
        </li>


      </ul>
    </div>
  )
}

export default Sidebar
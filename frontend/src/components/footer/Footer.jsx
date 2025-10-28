import React from 'react';
import './footer.css';
import { 
    AiFillFacebook, 
    AiFillTwitterSquare, 
    AiOutlineInstagram, 
} from "react-icons/ai";



const Footer = () => {
  return (
    <footer>
        <div className="footer-content">
            <p>
                &copy; 2025 Your Tutorial Platform. All rights reserved. <br />Made with ❤️
                <a href=''>Renu Kadam</a>
            </p>
            <div className="social-links">
                <a href=""><AiFillFacebook/></a>
                <a href=""><AiFillTwitterSquare/></a>
                <a href=""><AiOutlineInstagram/></a>
            </div>
        </div>
    </footer>
  )
}

export default Footer
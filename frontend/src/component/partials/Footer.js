import { RiFacebookFill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { Link } from "react-router-dom";

const Footer = ({isOpen}) => {
  
    return (
      <footer className="d-flex flex-wrap  align-items-center justify-content-center footer py-3" style={{paddingLeft: isOpen ? "230px": "0px"}}>
        <div className="footer-content">
          <div className="footer-links">
            <Link to="#" className="social-icon"><RiFacebookFill /></Link>
            <Link to="#" className="social-icon"><FaTelegramPlane /></Link>
            <Link to="#" className="social-icon"><AiFillInstagram /></Link>
          </div>
          <p className="d-inline">Inventory Management App.    </p>
          <p className="d-inline">YEBRHAN INC.    </p>
          <p>&copy; All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import './headers.css';
import { logoutUser } from '../../../services/authService';
import { SET_LOGIN } from '../../../redux/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectName } from '../../../redux/features/auth/authSlice';
import { HiMenuAlt3 } from "react-icons/hi";
import {IoClose } from "react-icons/io5"
import jokalogo from "../sidebar/ydlogo-removebg.png"
import menu from '../sidebar/menu';
import SidebarItems  from '../sidebar/SidebarItems';

const Header = ({isOpen, toggle}) => {


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

 

  const name = useSelector(selectName)

  const logout = async () => {
    try {
      await logoutUser();
      dispatch(SET_LOGIN(false))
      navigate("/login")
    } catch (error) {
    }
  }

    return (
      <div style={{transition: "1.2s"}}>
        <header className="d-flex flex-wrap  align-items-center justify-content-center justify-content-md-between py-3  border-bottom" 
        style={{paddingLeft: "5px"}}>
          {(windowWidth < 576) ? (
            <>
            <div className="me-auto" >
              <HiMenuAlt3 onClick={toggle} size={23} style={{ cursor: "pointer" }} color="black" />
            </div>
            <div className="me-auto">
                <h3 style={{color: "black"}}>Welcome, <span style={{color:"red"}}>{name}</span></h3>
              </div>
            <Link><button type="button" className="btn btn-outline-primary me-2" onClick={logout} style={{marginTop: "0px", marginBottom: "5px", fontSize: "1.5rem"}}>Sign-out</button></Link>

            
            <div className='sidebar1' style={{width: isOpen ? "230px" : "0px"}} isOpen={isOpen}>
            <div className=" top_section justify-content-md-between">
              
              <Link to="/"><img src={jokalogo} alt="jokalogo" width={100} height={90} style={{paddingLeft: "10px", display: isOpen ? "block" : "none", cursor: "pointer"}}/></Link>
              
                                  {/* <h3 style={{paddingLeft: "10px", display: isOpen ? "block" : "none"}}>Joka Trading</h3> */}
                <div style={{marginLeft: isOpen ? "80px" : "0px"}} className='bars'>
                <IoClose onClick={toggle} size={23} style={{cursor: "pointer"}}/>
                </div>
                </div>
                <div className='menu'>
                {menu.map((item, index) => (
                <SidebarItems key={index} item={item} isOpen={isOpen} />
              ))}
              </div>
            </div>
            </>
          ) : (
            <>
              <div className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <h3 style={{color: "black"}}>Welcome, <span style={{color:"red"}}>{name}</span></h3>
              </div>
              <div className="col-md-3 text-end justify-content-center">
                <Link to="/Profile" ><button type="button" className="btn btn-outline-primary me-2" style={{marginTop: "0px", marginBottom: "5px",fontSize: "1.5rem"}}>Profile</button></Link>
                <Link><button type="button" className="btn btn-outline-primary me-2" onClick={logout} style={{marginTop: "0px", marginBottom: "5px", fontSize: "1.5rem"}}>Sign-out</button></Link>
              </div>
            </>
          )}
        
          
        </header>
      </div>
    );
  };
  
  export default Header;
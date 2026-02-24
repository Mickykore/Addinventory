import { NavLink, Link } from 'react-router-dom';
import { MdDashboard, MdOutlineProductionQuantityLimits, MdFormatListBulletedAdd, MdCategory } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { GiSellCard } from "react-icons/gi";
import { HiMenuAlt3 } from "react-icons/hi";
import "./Sidebar.scss"
import { useState, useEffect } from 'react';
import ydlogo from "./ydlogo-removebg.png"
import menu from './menu';
import SidebarItems  from './SidebarItems';


const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
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

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className='layout' style={{height: "80vh"}}>
      {(windowWidth > 576) ? (
        <>
        <div className='sidebar1' style={{width: isOpen ? "230px" : "60px"}} isOpen={isOpen}>
      <div className=" top_section justify-content-md-between">
            <Link to="/"><img src={ydlogo} alt="ydlogo" width={100} height={90} style={{paddingLeft: "10px", display: isOpen ? "block" : "none", cursor: "pointer"}}/></Link>
          {/* <h3 style={{paddingLeft: "10px", display: isOpen ? "block" : "none"}}>Joka Trading</h3> */}
          <div style={{marginLeft: isOpen ? "80px" : "0px"}} className='bars'>
          <HiMenuAlt3 onClick={toggle} size={23} style={{cursor: "pointer"}}/>
          </div>
          </div>
          <div className='menu'>
          {menu.map((item, index) => (
          <SidebarItems key={index} item={item} isOpen={isOpen} />
        ))}
        </div>
      </div>

      <main style={{paddingLeft: isOpen ? "230px" : "60px", transition: "0.5s"}}>
      {children}
      </main>
        </>
      ) : (
        <>
          <div className='sidebar1' style={{width: "0px"}} isOpen={isOpen}>
          </div>
          <main style={{paddingLeft: "0px", transition: "0.9s"}}>
          {children}
          </main>
        </>
      )}
      
    </div>
  )
};

export default Sidebar;

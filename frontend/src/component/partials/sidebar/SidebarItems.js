import React from 'react';
import { NavLink } from 'react-router-dom';
import "./Sidebar.scss"
import { selectUserType } from '../../../redux/features/auth/authSlice';
import { useSelector } from 'react-redux';


const SidebarItems = ({ item, isOpen }) => {
  const activeLink = ({ isActive }) => (isActive ? "active" : "");
  const isActive = window.location.pathname === item.path;

  const open = isOpen;

  const userType = useSelector(selectUserType);
  const renderReports = (userType === "admin");

  if(renderReports) {
  return (
    <NavLink to={item.path} className={activeLink} style={{color: isActive ? "blue" : "black", textDecoration: "none"}}>
    <div className="sidebar-item">
      <div className="sidebar-title">
        <span>
          {item.icon && <div className="icon">{item.icon}</div>}
          {open ? <div className='title'>{item.title}</div> : null}
          {/* {isOpen && <div className='title'>{item.title}</div>} */}
        </span>
      </div>
    </div>
  </NavLink>
  );
};
if(item.title !== "Reports" && item.title !== "Users" && item.title !== "Dashboard" && item.title !== "Products") {
  return (
    <NavLink to={item.path} className={activeLink} style={{color: isActive ? "blue" : "black", textDecoration: "none"}}>
    <div className="sidebar-item">
      <div className="sidebar-title">
        <span>
          {item.icon && <div className="icon">{item.icon}</div>}
          {open && <div className='title'>{item.title}</div>}
        </span>
      </div>
    </div>
  </NavLink>
  );
};
}

export default SidebarItems;

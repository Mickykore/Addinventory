import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../../partials/header/headers.css'
import jokalogo from "../../partials/sidebar/add title bar4.png"
import { ShowOnLogout, ShowOnLogin } from '../../protect/HideElement'



export const LandingHeader = () => {

  const location = useLocation();

  return (
    <div className='LandingHeader'>
        <header className="d-flex flex-wrap  bg-light align-items-center justify-content-center justify-content-md-between py-3  border-bottom" 
        style={{backgroundColor: "#0a1930"}}>
        
          <div className="nav col-12  mb-2 justify-content-center mb-md-0">
            {/* <Link to="/"><img src={jokalogo} alt="jokalogo" width={100} height={90}/></Link> */}
            { location.pathname !== '/login' &&
            <ShowOnLogout >
              <Link className="btn btn-outline-info me-2" to="/login" style={{margin: "1.5px", fontSize: "1.5rem"}}>Login</Link>
            </ShowOnLogout>}

            { location.pathname !== '/signup' &&
            <ShowOnLogout>
              <Link className="btn btn-outline-info me-2" to="/signup" style={{margin: "1.5px", fontSize: "1.5rem"}}>Register</Link>
            </ShowOnLogout>}

            <ShowOnLogin>
            <Link className="btn btn-info me-2" to="/dashboard" style={{margin: "1.5px", fontSize: "1.5rem"}}>Dashboard</Link>
            </ShowOnLogin>
            { location.pathname !== '/' && <Link className="btn btn-info me-2" to="/" style={{margin: "1.5px", fontSize: "1.5rem"}}>Home</Link> }

          </div>
        </header>
      </div>
  )
}

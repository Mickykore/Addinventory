import React from 'react'
import { Link } from 'react-router-dom'

export const LandingFooter = () => {
  return (
    <footer className=" ms-sm-auto px-md-4 mt-auto py-3 bg-light">
      <div className='--flex-center --py2'>
      <div className="footer-links align-items-center">
        <Link to="#" className="social-icon"><i className="fab fa-facebook"></i></Link>
        <Link to="#" className="social-icon"><i className="fab fa-twitter"></i></Link>
        <Link to="#" className="social-icon"><i className="fab fa-instagram"></i></Link>
      </div>
        <p>Inventory Management App.</p>
        <p>YEBRHAN INC.    </p>
        <p>&copy; All rights reserved.</p>
      </div>
  </footer>
  )
}

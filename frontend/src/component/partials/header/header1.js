import { Link } from "react-router-dom";
import './headers.css';
import { logoutUser } from '../../../services/authService';
import { SET_LOGIN } from '../../../redux/features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectName } from '../../../redux/features/auth/authSlice';
import { HiMenuAlt3 } from 'react-icons/hi';
import jokalogo from '../sidebar/jokalogo4.png';

const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      <div >
        <nav className="navbar navbar-expand-sm bg-body-tertiary border-bottom" aria-label="Third navbar example">
    <div className="container-fluid">
      <a href="#" style={{color: "black"}}>Welcome, <span style={{color:"red"}}>{name}</span></a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample03" aria-controls="navbarsExample03" aria-expanded="false" aria-label="Toggle navigation">
        <HiMenuAlt3 size={23} color="black"/>
      </button>

      <div className="collapse navbar-collapse" id="navbarsExample03">
        <ul className="me-auto">
        </ul>
        <div className="">
        <Link><button type="button" className="btn btn-primary" style={{fontSize: "15px"}}>Profile</button></Link>
        </div>
        <div className="">
        <Link><button type="button" className="btn btn-outline-primary me-2" onClick={logout} style={{fontSize: "15px"}}>Sign-out</button></Link>
        </div>
      </div>
    </div>
  </nav>
      </div>
    );
  };
  
  export default Header;

  
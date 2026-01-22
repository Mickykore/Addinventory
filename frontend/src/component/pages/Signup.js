import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdPersonAdd } from "react-icons/io";
import '../../signin.css';
import { toast } from 'react-toastify';
import { validateEmail, registerUser } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { SET_NAME } from '../../redux/features/auth/authSlice';
import Loader from '../../loader/Loader';
import ButtonLoading from '../../loader/ButtonLoader';
import { LandingHeader } from './landing/LandingHeader';
import Footer  from './../partials/Footer';

const initialState = {
  firstname: "", 
  fathername: "",
  email: "",
  password: "",
  confirmPassword: "",
  userType: "employee",
  adminSecretKey: "",
  employeeSecretKey: ""
};

export const Signup = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [userForm, setUserForm] = useState(initialState);


  const { firstname, fathername, email, password, confirmPassword, adminSecretKey, employeeSecretKey, userType } = userForm;

  const handleChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  const register = async (e) => {
    e.preventDefault()

    if (!firstname || !fathername || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all fields")
    }
    if (!validateEmail(email)) {
      return toast.error("Invalid email")
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters")
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match")
    }

    const userData =  {
      firstname,
      fathername,
      email,
      password,
      ...(userType === "admin" ? { adminSecretKey } : { employeeSecretKey }),
      userType
    }

    setIsLoading(true)
    try {
      const response = await registerUser(userData);
        // await dispatch(SET_LOGIN(true))
        await dispatch(SET_NAME(response.firstname))
        navigate("/login")
        setIsLoading(false)
        setUserForm(initialState)
    } catch (error) {
      setIsLoading(false)
    }
    
  }
  return (
    <>
    <LandingHeader />
    <main className="form-signin" style={{height: "80vh"}}>
      <form className="bg-white" onSubmit={register}>

        <h1><IoMdPersonAdd size={35}/></h1>
        <h1 className="h3 mb-3 fw-normal" style={{color: "indigo"}}>Please Sign Up</h1>

        <div className="form-check form-check-inline">
          <input type="radio" id="employee" className="form-check-input mb-4" name="userType" value="employee" checked={userType === "employee"} onChange={handleChange} />
          <label className="form-check-label" for="employee">Employee</label>
        </div>

        <div className="form-check form-check-inline">
          <input type="radio" id="admin" className="form-check-input" name="userType" value="admin" onChange={handleChange} />
          <label className="form-check-label" for="admin">Admin</label>
        </div>

        <div className="form-outline mb-4 form-floating">
          <input type="text" id="firstName" className="form-control form-control-lg" name="firstname" value={firstname} onChange={handleChange}/>
          <label htmlFor="firstname">firstname</label>
        </div>

        <div className="form-outline mb-4 form-floating">
          <input type="text" id="fathername" className="form-control form-control-lg" name="fathername" value={fathername} onChange={handleChange}/>
          <label htmlFor="fathername">fathername</label>
        </div>

        <div className="form-outline mb-4 form-floating">
          <input type="email" id="email" className="form-control form-control-lg" name="email" value={email} onChange={handleChange}/>
          <label htmlFor="email">Email</label>
        </div>

        <div className="form-outline mb-4 form-floating">
          <input type="password" id="password" className="form-control form-control-lg" name="password" value={password} onChange={handleChange}/>
          <label htmlFor="password">Password</label>
        </div>
        <div className="form-outline mb-4 form-floating">
          <input type="password" id="confirmPassword" className="form-control form-control-lg" name="confirmPassword" value={confirmPassword} onChange={handleChange}/>
          <label htmlFor="confirmPassword">Confirm Password</label>
        </div>
        {userType === "admin" ? 
        <div className="form-outline mb-4 form-floating">
          <input type="password" id="adminSecretKey" className="form-control form-control-lg" name="adminSecretKey" value={adminSecretKey} onChange={handleChange}/>
          <label htmlFor="adminSecretKey">use"ADMIN@inventory"</label>
        </div>
        : null}
        {userType === "employee" ? 
        <div className="form-outline mb-4 form-floating">
          <input type="password" id="employeeSecretKey" className="form-control form-control-lg" name="employeeSecretKey" value={employeeSecretKey} onChange={handleChange}/>
          <label htmlFor="employeeSecretKey">use"EMPLOYEE@inventory"</label>
        </div>
        : null}
          {isLoading ? (
          <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
            ) : (
              <button className="btn btn-lg btn-primary" type="submit">Sign Up</button>
          )}
              
        <p className="text-center text-muted mt-5 mb-2">Have already an account? <Link to="/login" className="fw-bold mb-2 mb-md-0 me-2" style={{ color: 'blue' }}><u>Login here</u></Link></p>
        <p className="text-center text-muted mb-2"><Link to="/" className="fw-bold mb-2 mb-md-0 me-2" style={{ color: 'blue' }}><u>Home</u></Link></p>

        <h1>{isLoading && <Loader size={70} />}</h1>
      </form>
      
    </main>
    <Footer />
    </>
  )
}

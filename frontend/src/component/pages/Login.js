import React from 'react'
import { Link } from 'react-router-dom'
import { FaSignInAlt } from "react-icons/fa";
// import '../../../src/signin.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SET_LOGIN, SET_NAME, SET_USER, SET_USER_TYPE  } from '../../redux/features/auth/authSlice';
import { toast } from 'react-toastify';
import { validateEmail, loginUser } from '../../services/authService';
import ButtonLoading from '../../loader/ButtonLoader';
import { LandingHeader } from './landing/LandingHeader';
import Footer  from './../partials/Footer';

const initialState = {
  email: "",
  password: "",
};

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [userForm, setUserForm] = useState(initialState);

  const { email, password } = userForm;

  const handleChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  const login = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      return toast.error("Please fill in all fields")
    }
    if (!validateEmail(email)) {
      return toast.error("Invalid email")
    }

    const userData =  {
      email,
      password
    }

    setIsLoading(true)
    try {
      const data = await loginUser(userData);
        await dispatch(SET_LOGIN(true))
        await dispatch(SET_NAME(data.firstname))
        dispatch(SET_USER(data))
        dispatch(SET_USER_TYPE (data.userType))
          navigate("/dashboard")
        setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }
  return (
    <>
    <LandingHeader />
    <main className="form-signin" style={{height: "80vh"}}>
      <form className="bg-white" onSubmit={login}>

        <h1><FaSignInAlt size={35}/></h1>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-outline mb-4 form-floating">
          <input type="email" className="form-control form-control-lg" id="email" placeholder="name@example.com" name="email" value={email} onChange={handleChange}/>
          <label htmlFor="email">Email address</label>
        </div>
        <div className="form-outline mb-4 form-floating">
          <input type="password" className="form-control form-control-lg" id="password" placeholder="Password" name="password" value={password} onChange={handleChange}/>
          <label htmlFor="password">Password</label>
        </div>
        {isLoading ? (
          <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
            ) : (
              <button className="btn btn-lg btn-primary" type="submit">Sign in</button>
          )}
        <p className="text-center text-muted mt-5 mb-2">Don't have an account? <Link to="/signup" className="fw-bold mb-2 mb-md-0 me-2" style={{ color: 'blue' }}><u>Sign up</u></Link></p>
        <p className="text-center text-muted mb-2">Forget Password? <Link to="/ForgotPassword" className="fw-bold mb-2 mb-md-0 me-2" style={{ color: 'blue' }}><u>Forget Password</u></Link></p>
        <p className="text-center text-muted mb-2"><Link to="/" className="fw-bold mb-2 mb-md-0 me-2" style={{ color: 'blue' }}><u>Home</u></Link></p>

        {/* <a href="/signup"><button type="button" className="btn btn-primary">Sign-up</button></a> */}
      </form>
    </main>
    <Footer />
    </>
  )
}

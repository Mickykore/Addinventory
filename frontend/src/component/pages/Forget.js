import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgetpassword } from '../../services/authService'
import { toast } from 'react-toastify'
import { validateEmail } from '../../services/authService'
import ButtonLoading from '../../loader/ButtonLoader'
import { LandingHeader } from './landing/LandingHeader'
import Footer from '../partials/Footer'

export const Forget = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const forget = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email")
    }

    if (!validateEmail(email)) {
      toast.error("please enter a valid email")
    }

    const userData =  {
      email
  }
  setIsLoading(true)
  try {
    await forgetpassword(userData)
    setEmail("")
    setIsLoading(false)
  } catch (error) {
    setIsLoading(false)
  } 
}

  

  return (
    <>
    <LandingHeader />
    <main className="form-signin" style={{height: "80vh"}}>
      <form onSubmit={forget}>
        <h1 className="mb-4" width="72" height="57">MD.</h1>
        <h1 className="h3 mb-3 fw-normal">Forgot Password</h1>

        <div className="form-floating">
          <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" name="email" value={email} onChange={(e) =>
          setEmail(e.target.value)}/>
          <label htmlFor="floatingInput">Email address</label>
        </div>
        {isLoading ? (
          <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
            ) : (
              <button className="btn btn-lg btn-primary" type="submit">Get Reset Email</button>
          )}
        <p className="text-center text-muted mt-5 mb-2"><Link to="/Login" className="fw-bold mb-2 mb-md-0 me-2" style={{ color: 'blue' }}><u>Sign in</u></Link></p>
        {/* <a href="/signup"><button type="button" className="btn btn-primary">Sign-up</button></a> */}
      </form>
    </main>
    <Footer />
    </>
  )
}

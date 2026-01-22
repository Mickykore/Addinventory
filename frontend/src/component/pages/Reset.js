import React from 'react'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { resetpassword } from '../../services/authService'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import ButtonLoading from '../../loader/ButtonLoader'


const initialState = {
  password: "",
  confirmPassword: ""
};

export const Reset = () => {

  const [userForm, setUserForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { password, confirmPassword } = userForm;

  const { resetToken } = useParams()
  const navigate = useNavigate()
  const handleInputChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  const reset = async (e) => {
    e.preventDefault()

    if (password < 6) {
      return toast.error("Password must be at least 6 characters")
    }
    if (!password || !confirmPassword) {
      return toast.error("Please enter your password")
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match")
    }
    const userData =  {
      password
  }
  setIsLoading(true)
  try {
    const data = await resetpassword(userData, resetToken)
    toast.success(data.message)
    navigate("/login")
    setIsLoading(false)
  } catch (error) {
    setIsLoading(false)
  }
}

  return (
    <main className="form-signin">
      <form onSubmit={reset}>
        <h1 className="mb-4" width="72" height="57">MD.</h1>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-floating">
          <input type="password" className="form-control" id="floatingPassword" placeholder="New Password" name="password" value={password} onChange={handleInputChange}/>
          <label htmlFor="floatingPassword">New Password</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm New Password" name="confirmPassword" value={confirmPassword} onChange={handleInputChange}/>
          <label htmlFor="floatingPassword">Confirm New Password</label>
        </div>
        {isLoading ? (
          <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
            ) : (
              <button className="btn btn-lg btn-primary" type="submit">Reset Password</button>
          )}
        {/* <a href="/signup"><button type="button" className="btn btn-primary">Sign-up</button></a> */}
      </form>
    </main>
  )
}

import React from 'react'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { updatePassword } from '../../services/authService'
import ButtonLoading from '../../loader/ButtonLoader'


const initialState = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
};

export const UptadePassword = () => {

  const [userForm, setUserForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const { oldPassword, newPassword, confirmPassword } = userForm;

  const handleInputChange = (e) => {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  const update = async (e) => {
    e.preventDefault()

    if (newPassword < 6) {
      return toast.error("Password must be at least 6 characters")
    }
    if (!newPassword || !confirmPassword) {
      return toast.error("Please enter your newPassword")
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match")
    }
    const userData =  {
        oldPassword,
        newPassword
  }
  setIsLoading(true)
  try {
    const data = await updatePassword(userData)
    // toast.success(data)
    setIsLoading(false)
    setUserForm(initialState)
  } catch (error) {
    setIsLoading(false)
  }
}

  return (
    <main className="form-signin">
      <form onSubmit={update} className="g-3 col-md-5 p-3">
        <h1 className="h3 mb-3 fw-normal">Update Password</h1>
        <div>
          <input type="password" className="form-control" id="oldPassword" placeholder="Old Password" name="oldPassword" value={oldPassword} onChange={handleInputChange}/>
        </div>
        <div>
          <input type="password" className="form-control" id="newPassword" placeholder="New Password" name="newPassword" value={newPassword} onChange={handleInputChange}/>
        </div>
        <div>
          <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm New Password" name="confirmPassword" value={confirmPassword} onChange={handleInputChange}/>
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

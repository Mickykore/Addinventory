
import { useRedirectLogOutUser } from "../../customHook/useRedirectLogOutUser";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER, SET_NAME, selectUser } from "../../redux/features/auth/authSlice";
import { getUserProfiile } from "../../services/authService";
import { useState } from "react";

export const UpdateProfile = () => {

    useRedirectLogOutUser()

    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const initialState = {
        firstname: user?.firstname,
        fathername: user?.fathername,
        email: user?.email,
        phone: user?.phone,
        photo: user?.photo,
    }
    const [userData, setUserData] = useState(initialState);
    const [userImage, setUserImage] = useState(user?.photo);
    const [isLoading, setIsLoading] = useState(false);




    const handleImageChange = (e) => {
        setUserImage(e.target.files[0])
    }

    const handleInputChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    const saveProfile = async (e) => { 
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('firstname', userData.firstname)
        formData.append('fathername', userData.fathername)
        formData.append('email', userData.email)
        formData.append('phone', userData.phone)
        formData.append('photo', userData.photo)
        const user = await getUserProfiile(formData);

        dispatch(SET_USER(user));
        dispatch(SET_NAME(user.firstname));
        setIsLoading(false);
    } 




    return (
        <div className="container-fluid profile">
        <h1 className="text-center display-4">Update Profile</h1>
        <form id="hide-onprint" onSubmit={saveProfile} className="g-3 col-md-5" style={{fontSize: "1.5rem", padding: "1.5rem"}}>
            <div>
              <label className="form-label">First Name</label>
              <input className="form-control" placeholder="First Name" type="text" name="firstname" value={user?.firstname} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Father Name</label>
              <input className="form-control" placeholder="Father Name" type="text" name="fathername" value={user?.fathername} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input className="form-control" type="text" placeholder="Email" name="email" value={user?.email} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input className="form-control" type="text" placeholder="Phone Number" name="phone" value={user?.phone} onChange={handleInputChange} />
            </div>
            <div>
              <label className="form-label">Photo</label>
              <input className="form-control" type="file" placeholder="photo" name="photo" onChange={handleImageChange} />
            </div>
            <div>
            <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </form>
    </div>
    )
}

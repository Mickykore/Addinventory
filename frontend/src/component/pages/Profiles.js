
import { useRedirectLogOutUser } from "../../customHook/useRedirectLogOutUser";
import { useDispatch } from "react-redux";
import { SET_USER, SET_NAME } from "../../redux/features/auth/authSlice";
import { getUserProfiile, updateUserProfile } from "../../services/authService";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ButtonLoading from '../../loader/ButtonLoader';
import { UptadePassword } from "./UpdatePassword";


const initialState = {
  firstname: "",
  fathername: "",
  email: "",
  phone: "",
  photo: "",
  password: ""
}

export const Profile = () => {

  useRedirectLogOutUser()


  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState(initialState);
  const [userImage, setUserImage] = useState(userData?.photo);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const { firstname, fathername, email, phone, photo, password, userType } = userData;


  useEffect(() => {
    setIsLoading(true);
    async function getuser() {
      const profile = await getUserProfiile();

      setUserData(profile);
      dispatch(SET_USER(profile));
      dispatch(SET_NAME(profile.firstname));
      setIsLoading(false);
    }
    getuser();
  },[dispatch, setUserData])


  const handleImageChange = (e) => {
    setUserImage(e.target.files[0])
}

const handleInputChange = (e) => {
  setUserData({...userData, [e.target.name]: e.target.value});
}
const saveProfile = async (e) => { 
  e.preventDefault();
  if(!password) {
    toast.error("Password is required to update profile data");
    return;
  }
  setIsLoading(true);
  try {
    let imageURl;
    if(userImage && (userImage.type === "image/jpeg" || userImage.type === "image/png" || userImage.type === "image/jpg")) {
      const image = new FormData();
      image.append("file", userImage);
      image.append("cloud_name", "jokatrading");
      image.append("upload_preset", "dyiwtloq");

      const res = await fetch("https://api.cloudinary.com/v1_1/jokatrading/image/upload", 
      {
        method: "post",
        body: image
    })
    const data = await res.json();
    imageURl = data.url.toString();
    }
    const profileData = {
      firstname,
      fathername,
      email,
      phone,
      photo: imageURl || "",
      password,
      userType
    }
    const user = await updateUserProfile(profileData);
    dispatch(SET_USER(profileData));
    dispatch(SET_NAME(profileData.firstname));
    setUserData(profileData);
  } catch (error) {
    setIsLoading(false);
    toast.error("Image upload failed")
  }
  // const formData = new FormData();
  // formData.append('firstname', userData.firstname)
  // formData.append('fathername', userData.fathername)
  // formData.append('email', userData.email)
  // formData.append('phone', userData.phone)
  // formData.append('password', userData.password)
  // // formData.append('photo', imageURl)

  // const user = await updateUserProfile(formData);
  // dispatch(SET_USER(formData));
  // dispatch(SET_NAME(formData.firstname));
  setIsLoading(false);
} 




  return (
    <div className="container-fluid profile">
      <h1 className="text-center display-4">Profile</h1>
      <div>
          <ul class="nav nav-pills">
            <li class="nav-item">
            <button  className={showUpdatePassword ? 'nav-link' : 'nav-link disabled'} onClick={() => setShowUpdatePassword(false)}>Update profile</button>
            </li>
            <li class="nav-item">
            <button  className={showUpdatePassword ? 'nav-link disabled' : 'nav-link'} onClick={() => setShowUpdatePassword(true)}>Update Password</button>
            </li>
          </ul>
      </div>

      {!showUpdatePassword && 
        <div className="row">
        <div className="col-md-4 d-flex justify-content-center align-items-center">
          <img
            src={userData.photo}
            alt="profile"
            className="img-thumbnail rounded-circle"
            style={{ width: "200px", height: "200px" }}
          />
        </div>
        <div className="col-md-8 align-items-center justify-content-center">
            <form id="hide-onprint" onSubmit={saveProfile} className="g-3 col-md-5" style={{fontSize: "1.5rem", padding: "1.5rem"}}>
              <div>
                <label className="form-label">First Name</label>
                <input className="form-control" placeholder="First Name" type="text" name="firstname" value={userData?.firstname} onChange={handleInputChange} />
              </div>
              <div>
                <label className="form-label">Father Name</label>
                <input className="form-control" placeholder="Father Name" type="text" name="fathername" value={userData?.fathername} onChange={handleInputChange} />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input className="form-control" type="text" placeholder="Email" name="email" value={userData?.email} onChange={handleInputChange} />
              </div>
              <div>
                <label className="form-label">Phone Number</label>
                <input className="form-control" type="text" placeholder="Phone Number" name="phone" value={userData.phone} onChange={handleInputChange} />
              </div>
              <div>
                <label className="form-label">Photo</label>
                <input className="form-control" type="file" placeholder="photo" name="photo" onChange={handleImageChange} />
              </div>
              <div>
                <label className="form-label">Enter password to Uptade Profile Data</label>
                <input className="form-control" type="password" placeholder="password" autoComplete="off" name="password" value={userData.password} onChange={handleInputChange} />
              </div>
              {/* <div>
              <button type="submit" className="btn btn-primary">Submit</button>
              </div> */}
                {isLoading ? (
                  <ButtonLoading className="btn btn-lg btn-primary " type="submit" disabled>Loading...</ButtonLoading>
                    ) : (
                      <button className="btn btn-lg btn-primary" type="submit">update Profile</button>
                )}
            </form>
        </div>
      </div>
      }
      
      {showUpdatePassword && <UptadePassword />}
  </div>
  )
}

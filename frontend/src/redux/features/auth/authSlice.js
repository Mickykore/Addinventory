import { createSlice } from '@reduxjs/toolkit'

const username = JSON.parse(localStorage.getItem("firstname")) 
const userType = JSON.parse(localStorage.getItem("userType"))



const initialState = {
    isLoggedIn: false,
    firstname: username ? username : "",
    userType: userType ? userType : "",
    user: {
        firstname: "",
        fathername: "",
        email: "",
        phone: "",
        photo: "",
        userType: ""
    },
    users: []
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_LOGIN: (state, action) => {
      state.isLoggedIn = action.payload
    },
    SET_NAME: (state, action) => {
      localStorage.setItem("firstname", JSON.stringify(action.payload))
      state.firstname = action.payload
    },
    SET_USER: (state, action) => {
      console.log("payload", action.payload);
      const { firstname, fathername, email, photo, userType, phone} = action.payload;
      localStorage.setItem("userType", JSON.stringify(userType))
      console.log("fiuuu", action.payload)
      state.user = { firstname, fathername ,email, photo, phone, userType };
    },
    SET_USERS: (state, action) => {
      state.users = action.payload
    },
    SET_USER_TYPE: (state, action) => {
      state.userType = action.payload
    }
  }
});

export const { SET_LOGIN, SET_NAME, SET_USER, SET_USERS, SET_USER_TYPE } = authSlice.actions

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectUser = state => state.auth.user
export const selectUsers = state => state.auth.users
export const selectName = state => state.auth.firstname
export const selectUserType = state => state.auth.userType

export default authSlice.reducer
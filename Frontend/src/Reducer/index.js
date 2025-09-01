import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Slice/authSlice"
import profileReducer from "../Slice/profileSlice"
import dashboardReducer from "../Slice/dashboardSlice"


const rootReducer =combineReducers({
    auth:authReducer, 
    profile:profileReducer,
    dashboard:dashboardReducer
})

export default rootReducer;
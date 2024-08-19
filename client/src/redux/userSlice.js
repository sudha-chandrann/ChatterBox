import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id:'',
    name:'',
    email:'',
    profile_pic:'',
    isAuth: false,
    onlineUser:[],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.name = action.payload.name;
            state.id = action.payload._id;
            state.email = action.payload.email;
            state.profile_pic = action.payload.profile_pic;
            state.isAuth = true;
        },
        logout: (state) => {
            state.id = '';
            state.name = '';
            state.email = '';
            state.profile_pic = '';
            state.isAuth = false;
        },
        setonlineuser:(state,action)=>{
            state.onlineUser=action.payload;
        }
       
    },
});

export const { login, logout ,setonlineuser} = authSlice.actions;
export default authSlice.reducer;

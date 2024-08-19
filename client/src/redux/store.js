import {configureStore} from '@reduxjs/toolkit';
import AuthSlice from "./userSlice"
const store =configureStore(
    {
        reducer:{
            auth:AuthSlice,
          
        },
    }
)

export default store;



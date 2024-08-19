import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import MessagePage from './components/MessagePage.jsx'
import Home from './pages/Home.jsx'
import { Provider} from 'react-redux'
import store from "./redux/store.js"
const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
          path:"",
          element:<Home/>,
          children: [
            {
              path: ":userId",
              element: <MessagePage />,
            },
          ],
      },
      {
        path:"login",
        element:<Login/>
      },
      {
        path:"register",
        element:<Register/>
      },

    ]

  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Provider store={store}>
   <RouterProvider router={router}/>
   </Provider> 
  </StrictMode>,
)

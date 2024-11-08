import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider, Route} from 'react-router-dom'

import './index.css'
import App from './App.jsx'

// Importação das Páginas
import Home from './routes/Home.jsx'
import WeatherConditions from './routes/WeatherConditions.jsx'

const router = createBrowserRouter([
  {
    element: <App/>,
    children: [
      {
        path: "https://fernando-goncalves-santos.github.io/weatherApp/",
        element: <Home/>
      },
      {
        path: "https://fernando-goncalves-santos.github.io/weatherApp/results",
        element: <WeatherConditions/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Loader from 'components/layout/Loader'

function App() {
    // Authentication
    useEffect(() => {
        const loginToken = localStorage.getItem("login_token");
        if(loginToken) {
            window.location.href = '/dashboard'
        } else {
          window.location.href = '/login'
        } 
    }, [])
    
    return (
        <Loader />
    )
}

export default App

import React, { useContext } from 'react'
import Swal from 'sweetalert2';
import './Login.css'
import { useState } from 'react';


const Login = () => {
    let [status, setStatus] = useState("Login");
        let [Formdata, setFormdata] = useState({
            username: "",
            email: "",
            password: ""
        })
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const Login = async () => {
        console.log("login have been clicked")
        let response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: Formdata.email,password: Formdata.password })
        })


        let data = await response.json();
        console.log("after data")
        if (data.success) {

            localStorage.setItem("auth-token", data.token);
            window.location.replace("/");
        }
        else {
            console.log("else is here")
            Swal.fire({
                title: "Invalid user data!",
                text: "Please verify your information!",
                icon: "error"
            })

        }


    }

    const Handelchange = (e) => {
        setFormdata((prev) => { return { ...prev, [e.target.name]: e.target.value } })
    }

    console.log(Formdata)
    return (
        <div className="login">
            <div className='container'>
                <div className='content'>
                    <div className='form'>
                        <h2>{status} to PetPall</h2>
                        <div className='signfields'>
                            {status === "Signup" ? <input onChange={Handelchange} name="username" type="text" placeholder="Enter Your Username" /> : ""}
                            <input onChange={Handelchange} type="email" name="email" placeholder="Nom d'utilisateur" />
                            <input onChange={Handelchange} type="password" name="password" placeholder="Password" />
                        </div>
                        <div className='submit'><button onClick={() => { Login() }}>Login</button></div>

                    </div>
                </div>
            </div>
        </div>
    )

}
export default Login
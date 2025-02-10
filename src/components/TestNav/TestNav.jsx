import React, { useContext, useRef } from 'react'

import "./TestNav.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faBars, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link,useNavigate  } from 'react-router-dom';

const TestNav = () => {
    const navigate = useNavigate()
    
    let Listref = useRef();
    const Handel = (e) => {
        Listref.current.classList.toggle("pop")
    }

    const Redirecttologin = () => {
        return navigate("/login");
    }

    return (
        <div className="navbar">
            <div className="container">
                <div className="content">
                    <div className='title'>FoodYox</div>

                    <div className='options'>

                        <ul ref={Listref}>
                           <li>Home</li>
                           <li>Pizza</li>
                           <li>Burgers</li>
                           <li>Sandwiches</li>
                           {localStorage.getItem("auth-token") ? <li className="login-mobile" onClick={() => { localStorage.removeItem("auth-token"); window.location.replace("/login") }}>Logout</li> : <Link style={{ textDecoration: 'none' }} to="login"><li className="login-mobile">Login</li></Link>}

                        </ul>
                        {/* <button>Login</button> */}
                    </div>

                    <div className='loginandcart'>
                        <FontAwesomeIcon className="barcontrole" icon={faBars} onClick={(e) => { Handel(e) }} />
                        {localStorage.getItem("auth-token") ? <button onClick={() => { localStorage.removeItem("auth-token");localStorage.removeItem("Foodyoxusername"); window.location.replace("/login");socket.disconnect()}}>Logout</button> : <Link to="login"><button>Login</button></Link>}
                        {/* <Link to="login"><button>Login</button></Link> */}
                        <div className='shoppingcart'>
                            <Link to="cart"><FontAwesomeIcon icon={faCartShopping} /></Link>
                            
                        </div>

                        {localStorage.getItem("auth-token") ? <div class="dropdown">
                            <FontAwesomeIcon icon={faUser} className='dropbtn' />
                            {notificationOn?<div className='neworder-notif'></div>:""}
                            <div class="dropdown-content">
                                <Link to="/Myorders">My Orders</Link>
                            </div>
                        </div> : ""}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TestNav
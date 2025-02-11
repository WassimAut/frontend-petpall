import React,{useRef} from 'react'

import "./Navbar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faBars, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
const Navbar = () => {

  let Listref = useRef();
    const Handel = (e) => {
        Listref.current.classList.toggle("pop")
    }

    const handleLogin = () => {
      const navigate = useNavigate();
      navigate("/login");
    };
  
  return (
    <div className='navbar'>
      <div className='container'>

        <div className='content'>
          <span>PetPall</span>

          <div className='right'>
          <FontAwesomeIcon className="barcontrole" icon={faBars} onClick={(e) => { Handel(e) }} />
            <ul ref={Listref}>
              <Link to="/" style={{ textDecoration: 'none',color:"black" }}><li>Planifiez</li></Link>
              <Link to="history" style={{ textDecoration: 'none',color:"black" }}><li>Historique</li></Link>
              {/*<Link to="login" ><li><button>Login</button></li></Link>*/}
              {localStorage.getItem("auth-token") ? <li className="login-mobile" onClick={() => { localStorage.removeItem("auth-token"); window.location.replace("/") }}><button>Logout</button></li> : <Link style={{ textDecoration: 'none' }} to="login"><li className="login-mobile"><button>Login</button></li></Link>}
            </ul>
            
          </div>
        </div>


      </div>

    </div>
  )
}

export default Navbar
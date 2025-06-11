import { useState } from 'react'
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import './Signup.css'

function Signup(){
    return(
    <>
    <div className="body">
        <div className='wrapper'>
        <form action=''>
            <h1>Sign Up</h1>
            <div className='input-box'>
                <input type="text" placeholder='Username' required/>
                < i class='bx  bx-user'  ></i>
            </div>
            <div className='input-box'>
                <input type="password" placeholder='Password' required/>
                < i class='bx  bx-lock'  ></i> 
            </div>
            <div className='remember-forgot'>
                <label> <input type='checkbox'/>Remember Me</label>
                <Link to='/pass-reset' className='nav-link'>Forgot password?</Link>
            </div>
            <Link>
                <button type='submit' className='button'>Login</button>
            </Link>

            <div className='register-link'>
                <p>Don't have an Account?
                    <Link to="/signup" className='nav_link'>Sign Up</Link>
                </p>
            </div>
        </form>
        </div>
    </div>
    </>
    );
};

export default Signup;
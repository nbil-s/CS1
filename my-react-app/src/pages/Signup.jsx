import { useState } from 'react'
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faUser, faEnvelopeOpen, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";      
import usePasswordToggle from '../hooks/usePasswordToggle';
import './Signup.css'

function Signup(){
    const [PasswordInputType, ToggleIcon] = usePasswordToggle();

    return(
    <>
    <div className="body">
        <div className='wrapper'>
        <form action=''>
            <h1>Register</h1>
            <div className='input-box'>
                <input type="text" placeholder='Enter Your Name' required/>
                < i class='bx  bx-user'  ></i>
            </div>
            <div className='input-box'>
                <input type="text" placeholder='Enter email address' required/>
                < i class='bx  bx-envelope-open'  ></i>
            </div>
            <div className='input-box'>
                <input
                    type={PasswordInputType}
                    placeholder='Password'
                    id='password'
                    required
                />
                <span className='password-toggle-icon'>
                    {ToggleIcon}
                </span>
            </div>
            <div className='input-box'>
                <input
                    type={PasswordInputType}
                    placeholder='Confirm Password'
                    id='password'
                    required
                />
                <span className='password-toggle-icon'>
                    {ToggleIcon}
                </span>
            </div>
            <Link to={'/numberanddetails'}>
                <button type='submit' className='button'>Sign Up</button>
            </Link>
        </form>
        </div>
        
    </div>
    </>
    );
};

export default Signup;
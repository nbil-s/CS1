import { useState } from 'react'
import NavBar from '../components/NavBar.jsx'
import { Link } from 'react-router-dom';

function Signup(){
    return(
    <>
    <div className='wrapper'>
        <form action=''>
            <h1>Login</h1>
            <div className='input-box'>
                <input type="text" placeholder='Username' required/>
            </div>
            <div className='input-box'>
                <input type="password" placeholder='Password' required/>
            </div>
            <div>
                <label> <input type='checkbox'/>Remember Me</label>
            </div>
            <a href="#">Forgot password?</a>
            <Link><button type='submit' className='btn'>Login</button></Link>

            <div className='register-link'>
                <p>Don't have an Account?
                    <Link to="/"></Link>
                </p>
            </div>
        </form>
    </div>
    </>
    );
};

export default Signup;
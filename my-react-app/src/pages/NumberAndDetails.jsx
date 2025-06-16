import React from 'react'
import { Link } from 'react-router-dom';
import './NumberAnddetails.css'

function NumberAndDetails(){
  return (
    <>
    <div className="body">
        <div className='wrapper'>
        <form action=''>
            <h1>Other Details</h1>
            <div className='input-box'>
                <input type="tel" placeholder='PhoneNumber' required/>
                < i className='bx  bx-user'  ></i>
            </div>
            <div className='input-box'>
                <input type="date" placeholder='DOB' required/>
                < i className='bx  bx-lock'  ></i> 
            </div>
            <div className='remember-forgot'>
                <label> <input type='checkbox'/>Remember Me</label>
                <Link to='/pass-reset' className='nav-link'>Forgot password?</Link>
            </div>
            <Link>
                <button type='submit' className='button'>Cofirm</button>
            </Link>
        </form>
        </div>
    </div>
    </>
  )
}

export default NumberAndDetails;
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css"
import './NumberAnddetails.css'

function NumberAndDetails(){
    const [phone, setPhone] = useState();

  return (
    <>
    <div className="body">
        <div className='wrapper'>
        <form action=''>
            <h1>Other Details</h1>
            <div className="input-box">
            <label>Phone Number</label>
            <PhoneInput className="PhoneInput"
              country="in"
              value={phone}
              onChange={setPhone}
              placeholder="Enter phone number"
              />
              < i class='bx  bx-user'  ></i>
            </div>
            <div className='input-box'>
            <label>Enter Date of Birth</label>
                <input type="date" placeholder='Enter Date of Birth' required/>
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
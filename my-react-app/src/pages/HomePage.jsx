import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import './Homepage.css'

function Homepage() {
  return (
    <>
      <div className="body">
        <div className="wrapper">
          <form>
            <h1>Queue Management System For Small General Clinics</h1>
            <div className="">
              <input type="text" placeholder="Username" required />
              <i className="bx bx-user"></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <i className="bx bx-lock"></i>
            </div>
            <div className="remember-forgot">
              <label><input type="checkbox" /> Remember Me</label>
              <Link to="/pass-reset" className="nav-link">Forgot password?</Link>
            </div>
            <button type="submit" className="button">Login</button>
            <div className="register-link">
              <p>Don't have an account? <Link to="/signup" className="nav-link">Sign Up</Link></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Homepage;

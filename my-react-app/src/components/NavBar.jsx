import React from 'react';
import { Link } from 'react-router-dom';


const NavBar = () => {
  return (
    <div className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/nav" className="navbar-brand">Navbar</Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
            aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link to="/homepage" className="nav-link active">Home</Link>
              <Link to="/features" className="nav-link">Features</Link>
              <Link to="/pricing" className="nav-link">Pricing</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="d-grid gap-2 d-md-flex justify-content-md-end p-3">
        <Link to="/login">
          <button type="button" className="btn btn-outline-primary">Login</button>
        </Link>
        <Link to="/signup">
          <button type="button" className="btn btn-outline-primary">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;

import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand" href="/">
          <img src="https://placehold.co/150x50?text=Logo+Here" alt="Logo" />
        </a>

        {/* Navbar Toggler for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Center Links */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item d-flex align-items-center justify-content-center">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item d-flex align-items-center justify-content-center">
              <a className="nav-link" href="/about">About</a>
            </li>
            <li className="nav-item d-flex align-items-center justify-content-center">
              <a className="nav-link" href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Right Buttons */}
        <div className="d-flex">
          <a href='/login' className="btn btn-login me-2" type="button">Log In</a>
          <a href='/signup' className="btn btn-create-account" type="button">Create Account</a>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

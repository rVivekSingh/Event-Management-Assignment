import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaPlusCircle } from 'react-icons/fa';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Event Manager
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/events">
              Events
            </Link>
            {auth.token ? (
              <>
                <Link className="nav-link" to="/create-event">
                  <FaPlusCircle /> Create Event
                </Link>
                <button className="nav-link btn btn-link text-light" onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
                {auth.user && (
                  <span className="navbar-text text-light ms-3">
                    Hello, {auth.user.name}
                  </span>
                )}
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">
                  <FaSignInAlt /> Login
                </Link>
                <Link className="nav-link" to="/register">
                  <FaUserPlus /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

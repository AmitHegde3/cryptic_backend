import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  let history = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    history("/login");
  }
  let location = useLocation();

  //   useEffect(() => {
  //     console.log(location.pathname);
  // }, [location]);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" >
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Cryptic
        </a>
        <button 
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname==="/"?"active":""}`} aria-current="page" >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={`nav-link ${location.pathname==="/about"?"active":""}`} >
                About
              </Link>
            </li>
          </ul>
          {!localStorage.getItem("token") ? <form className="d-flex">
            <Link to="/login" class="btn btn-primary mx-2" role="button">Login</Link>
            <Link to="/signup" class="btn btn-primary mx-2" role="button">Signup</Link>
          </form> :<button className="btn btn-primary" onClick={handleLogout}> Logout</button>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

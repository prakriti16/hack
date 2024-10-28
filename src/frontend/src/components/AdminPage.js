// Welcoming page in admin login
import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Dropdown, DropdownButton, Badge, Image } from 'react-bootstrap';
import '../styles/admin.css';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const token = localStorage.getItem('token');
  console.log("Token:", token);
  
  // State to handle mobile navigation toggle
  const [isMobileNavActive, setIsMobileNavActive] = useState(false);

  // useEffect to handle mobile navigation toggle
  useEffect(() => {
    const handleToggleMobileNav = () => {
      setIsMobileNavActive(prevState => !prevState);
    };

    const mobileNavToggleButton = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggleButton) {
      mobileNavToggleButton.addEventListener('click', handleToggleMobileNav);
    }

    return () => {
      if (mobileNavToggleButton) {
        mobileNavToggleButton.removeEventListener('click', handleToggleMobileNav);
      }
    };
  }, []);

  // useEffect hook to handle side effects for scrolling
  useEffect(() => {
    const selectHeader = document.querySelector('#header');

    const handleScroll = () => {
      if (selectHeader) {
        window.scrollY > 100 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
      }
    };
    
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <section id="admin">
        <header id="header" className="header fixed-top d-flex align-items-center">
          <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
          <div className="logo d-flex align-items-start">
          <img src="/static/logo.svg.png" alt="IIT Dharwad Logo" />
            <h1 style={{ marginBottom: '20px', marginLeft: '10px' }}>IIT Dharwad</h1>
            </div>
            <div className="link-container">
                    <Link to="/admin" className="custom-link">Home</Link>
                    <span className="separator"> | </span>
                    <Link to="/admin/medicine" className="custom-link">Medicines</Link>
                    <span className="separator"> | </span>
                    <Link to="/admin/pendingmeds" className="custom-link">Pending Medicines</Link>
                    <span className="separator"> | </span>
                    <Link to="/admin/appointment" className="custom-link">Appointments</Link>
                    
                  
            </div>
            </div>
            <nav className="header-nav ms-auto">
              <ul className="d-flex align-items-center list-unstyled m-4">
                <li className="nav-item dropdown">
                  <DropdownButton
                    menuAlign="right"
                    title={
                      <span className="nav-link nav-profile d-flex align-items-center pe-0">
                        <button 
                  className="btn d-flex align-items-center" 
                  style={{ 
                    border: 'none', 
                    backgroundColor: 'green', 
                    color: 'white', 
                    borderRadius: '5px', // Make it circular
                    padding: '5px' // Adjust padding as needed
                  }}
                >
                  <Image
                    src="../../img/profile.png"
                    alt="Profile"
                    className="rounded-circle me-2"
                    style={{ width: '30px', height: '30px' }} // Adjust size of the image
                  />
                  <span className="d-none d-md-block">User</span>
                </button>
                      </span>
                    }
                    id="dropdown-profile"
                  >
                    <Dropdown.Header>
                      <h6>User</h6>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item>
                      <Link className="dropdown-item d-flex align-items-center" to="/Login">
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Sign Out</span>
                      </Link>
                    </Dropdown.Item>
                  </DropdownButton>
                </li>
              </ul>
            </nav>
            <i className="bi bi-list mobile-nav-toggle"></i>
          
        </header>

        <div className="container-fluid mt-8 pt-5">
          <div className="row justify-content-center">
            <div className="col-md-4 text-center mb-3">
              <Link className="btn btn-primary" to="/admin">
                Home
              </Link>
            </div>
            <div className="col-md-4 text-center mb-3">
              <Link className="btn btn-secondary" to="/admin/medicine">
                Medicine Database
              </Link>
            </div>
            <div className="col-md-4 text-center mb-3">
              <Link className="btn btn-success" to="/admin/pendingmeds">
                Pending Medicines
              </Link>
            </div>
          </div>
        </div>

        <main id="main" className="main" style={{ height: '100vh', width: '100%' }}>
  <div className="pagetitle">
    <h1>Home</h1>
    <nav>
      <ol className="breadcrumb">
        <li className="breadcrumb-item active" style={{ color: "#ccc" }}>Home</li>
      </ol>
    </nav>
  </div>
  <section id="hero" className="hero section" style={{ height: '80%', width: '100%', display: 'flex', alignItems: 'center' }}>
    <div className="container">
      <div className="row gy-12 justify-content-center justify-content-lg-between">
        <div className="col-lg-8 order-2 order-lg-1 d-flex flex-column justify-content-center text-center">
          <h1>Welcome to<br />Admin Page</h1>
          <p>Indian Institute of Technology, Dharwad</p>
          <div className="d-flex"></div>
        </div>
      </div>
    </div>
  </section>
</main>


        <footer id="footer" className="footer" style={{ width: '100%' }}>
          <div className="container">
            <div className="row gy-3">
              <div className="col-lg-3 col-md-12 footer-info">
                <div className="logos">
                  <img src="/static/logo.svg.png" alt="Logo" className="logo" />
                </div>
                <h3>Indian Institute of Technology Dharwad</h3>
                <p>Permanent Campus</p>
                <p>Chikkamalligawad Village</p>
                <p>Dharwad, Karnataka, India - 580007</p>
                <p>Email: <a href="mailto:pro@iitdh.ac.in">pro@iitdh.ac.in</a></p>
              </div>

              <div className="col-lg-2 col-6 footer-links">
                <h4>Academics</h4>
                <ul>
                  <li><a href="#">Admissions</a></li>
                  <li><a href="#">Announcements</a></li>
                  <li><a href="#">Departments</a></li>
                  <li><a href="#">Programs</a></li>
                </ul>
              </div>

              <div className="col-lg-2 col-6 footer-links">
                <h4>Research</h4>
                <ul>
                  <li><a href="#">Consultancy Projects</a></li>
                  <li><a href="#">IRINS</a></li>
                  <li><a href="#">Project Vacancies</a></li>
                  <li><a href="#">Publications</a></li>
                  <li><a href="#">Sponsored Projects</a></li>
                </ul>
              </div>

              <div className="col-lg-2 col-6 footer-links">
                <h4>People</h4>
                <ul>
                  <li><a href="#">Administration</a></li>
                  <li><a href="#">Faculty</a></li>
                  <li><a href="#">Staff</a></li>
                  <li><a href="#">Students</a></li>
                </ul>
              </div>

              <div className="col-lg-2 col-6 footer-links">
                <h4>Quick Access</h4>
                <ul>
                  <li><a href="#">About Dharwad</a></li>
                  <li><a href="#">Bus Schedule</a></li>
                  <li><a href="#">Chief Vigilance Officer</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">Counselling Center</a></li>
                  <li><a href="#">CSR</a></li>
                  <li><a href="#">Events</a></li>
                  <li><a href="#">Grievance Redressal</a></li>
                  <li><a href="#">ICC</a></li>
                  <li><a href="#">Intranet</a></li>
                  <li><a href="#">Old Website</a></li>
                  <li><a href="#">RTI</a></li>
                  <li><a href="#">SC-ST-OBC Liaison Cell</a></li>
                  <li><a href="#">Tenders</a></li>
                  <li><a href="#">Videos</a></li>
                  <li><a href="#">VPN Access</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-legal">
            <div className="container">
              <div className="row justify-content-between">
                <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                  <div className="copyright">
                    &copy; <strong><span>2024 IIT Dharwad</span></strong>. All Rights Reserved
                  </div>
                </div>
                <div className="col-md-6 text-center text-md-end">
                  <div className="credits">
                    Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
}

export default AdminPage;

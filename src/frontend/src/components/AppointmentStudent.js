import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownButton, Badge, Image } from 'react-bootstrap';
import axios from 'axios';
import '../styles/User.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
const AppointmentStudent = () => {
    const [appointments, setAppointments] = useState([]);
    const [trafficLevel, setTrafficLevel] = useState('Low');
    const [profile, setProfile] = useState({});
    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register/profile`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            if (!response.ok) {
              throw new Error('Failed to fetch profile data');
            }
            const profileData = await response.json();
            setProfile(profileData);
            console.log("hihi", profile, profile.roll);

          } catch (error) {
            console.error('Error fetching profile:', error.message);
          }
        };
    
        fetchProfile();
    }, []);
    
    useEffect(() => {
        console.log("Updated profile state:", profile);
    }, [profile]);
    const fetchAppointments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/userappointments`);
            const data = await response.json();
            const userAppointments = data.filter(
                (appointment) => appointment.email === profile.email
            );
            console.log("Appointments data:", data);
            console.log("Filtered userAppointments:", userAppointments, profile.email);
    
            setAppointments(userAppointments);
    
            // Calculate traffic level based on appointments data
            calculateTrafficLevel(data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };
    
    useEffect(() => {
        // Only fetch appointments if profile is available and has the email property
        if (profile.email) {
            fetchAppointments();
        }
    }, [profile]);
    
    const calculateTrafficLevel = (appointments) => {
        const currentHour = new Date().getHours(); // Get the current hour

        // Count appointments for the current hour
        const hourCount = appointments.filter((appointment) => {
            const appointmentHour = new Date(`1970-01-01T${appointment.timeSlot}`).getHours(); // Extract hour from time slot
            return appointmentHour === currentHour;
        }).length;

        // Set traffic level based on the hour count
        if (hourCount > 10) {
            setTrafficLevel('High');
        } else if (hourCount >= 5) {
            setTrafficLevel('Medium');
        } else {
            setTrafficLevel('Low');
        }
    };
    const handleDelete = async (email, timeSlot) => {
        try {
          const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/${encodeURIComponent(email)}/${encodeURIComponent(timeSlot)}`);
          fetchAppointments();
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      };
    
    return (
        <section id="userhome">
            <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between" >
            <div className="logo d-flex align-items-start">
              <img src="/static/logo.svg.png" alt="IIT Dharwad Logo" />
              <h1 style={{ marginLeft: "10px" }}>IIT Dharwad</h1>
            </div>
            <div className="link-container">
                    <Link to="/UserPage" className="custom-link">Home</Link>
                    <span className="separator"> | </span>
                    <Link to="/UserPage/appointment" className="custom-link">My Appointments</Link>
                    <span className="separator"> | </span>
                    <Link to="/UserPage/Bookappointment" className="custom-link">Book Appointment</Link>
                    
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
        </header>
        <div className='main' style={{background: 'linear-gradient(rgba(14, 29, 52, 0.86), rgba(14, 29, 52, 0.493))',
        backgroundPosition: 'center center',
        backgroundSize: 'cover', // Adjust as needed
        backgroundRepeat: 'no-repeat'  }}>
            <div className="container">
            <h1>Appointments</h1>
        <nav>
            <ol className="breadcrumb">
            <li><Link to="/UserPage" className="custom-link">Home</Link></li>
            </ol>
        </nav>
        </div>
        <div>
            <h2>All Booked Appointments</h2>
            <div>
                <strong style={{color:'white'}}>Traffic Level:</strong> {trafficLevel === 'High' && <span style={{ color: 'red' }}>High Traffic</span>}
                {trafficLevel === 'Medium' && <span style={{ color: 'orange' }}>Medium Traffic</span>}
                {trafficLevel === 'Low' && <span style={{ color: 'green' }}>Low Traffic</span>}
            </div>
            <table border="1" style={{ width: '100%', textAlign: 'left', color:'black', background:'white'
             }}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Doctor Name</th>
                        <th>Date</th>
                        <th>Time Slot</th>
                        <th>Cancel</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                            <td>{appointment.email}</td>
                            <td>{appointment.doctorName}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.timeSlot}</td>
                            <td>
                                      <button
                                          className="btn btn-danger"
                                          onClick={() => handleDelete(appointment.email, appointment.timeSlot)}
                                        >
                                          Cancel
                                        </button>
                                      
                                    </td> 
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
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
        © Copyright <strong><span>IIT Dharwad</span></strong>. All Rights Reserved
        </div>

        <div className="credits">
        Designed by Pandas🐼
        </div>

    </div>

    <div className="col-md-6">
        <div className="social-links mb-3 mb-lg-0 text-center text-md-end">
        <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
        <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
        <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
        <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
        </div>

    </div>

    </div>

</div>
</div>
</footer>
        
        </section>
    
    );
};

export default AppointmentStudent;

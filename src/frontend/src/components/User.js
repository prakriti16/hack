import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton, Badge, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/User.css';

import axios from 'axios';
const DoctorSchedule = () => {
    const [schedule, setSchedule] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [profile, setProfile] = useState({});
    const [Patient, setPatient] = useState([]);
    
      
    useEffect(() => {
        if (profile) {
            fetchPatients();
        }
    }, [profile]);
      
      //Function to retrieve database information
        const fetchPatients = async () => {
          try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pendingdb`);
            const data = await response.data;
            const userAppointments = data.filter(
                (appointment) => appointment.email === profile.email
            );
            setPatient(userAppointments);
            console.log(Patient);
          } catch (error) {
            console.error('Error fetching patients:', error);
          }
        };
      
        const handleCancelMedicine = async (patientId, medicineIndex) => {
            const confirmCancel = window.confirm('Are you sure you want to cancel this medicine?');
          
            if (confirmCancel) {
              try {
                const patient = Patient.find(patient => patient._id === patientId); // Find patient by ID
                const { email, date, doctor } = patient; // Extract email and date
          
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pendingdb/medicines`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email, date, doctor, medicineIndex }), // Send data
                });
          
                if (!response.ok) {
                  throw new Error('Failed to cancel medicine');
                }
          
                const data = await response.json();
                alert(data.message); // Notify user
          
                // Update local state to reflect change
                setPatient(prevEntries => 
                  prevEntries.map(patient => {
                    if (patient._id === patientId) {
                      const updatedMedicines = patient.medicines.filter((_, index) => index !== medicineIndex);
                      return { ...patient, medicines: updatedMedicines };
                    }
                    return patient;
                  })
                );
          
              } catch (error) {
                alert('Error: ' + error.message);
              }
            }
          };
          
          
          
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Token:", token);
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
                setProfile(profileData);  // Set fetched profile data
                console.log("ProfileData:", profileData);
            } catch (error) {
                console.error('Error fetching profile:', error.message);
            }
        };
    
        fetchProfile();
    }, []);
    
    useEffect(() => {
        console.log("Updated profile state:", profile);
    }, [profile]);
    useEffect(() => {
        const fetchData = async () => {
           
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/schedule`);
            if (!response.ok) throw new Error('Failed to fetch schedule');
        
            const data = await response.json();
            
            // Transform the raw data if it's an array of arrays
            const formattedData = data.slice(2).map(row => ({
                siNo: row[0],
                name: row[1],
                qualification: row[2],
                specialization: row[3],
                date: row[4],
                time: row[5] // Assuming time is a range like "9:00-12:00"
            }));
            
            setSchedule(formattedData);

            // Extract unique doctor names for the dropdown
            const doctorNames = formattedData
                .filter(row => row.name && row.name !== 'Doctor Unavailable Today')
                .map(row => row.name);

            setDoctors([...new Set(doctorNames)]); // Remove duplicates

            const uniqueDates = formattedData
                .filter(row => row.date)
                .map(row => row.date);

            setDates([...new Set(uniqueDates)]); // Remove duplicates
        };
        fetchData();
    }, []);
/*
const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/schedule');
        const data = response.ok ? await response.json() : []; // Use empty array if fetch fails

        // Transform the raw data if it's an array of arrays
        const formattedData = data.slice(2).map(row => ({
            siNo: row[0],
            name: row[1],
            qualification: row[2],
            specialization: row[3],
            date: row[4],
            time: row[5]
        }));
        
        setSchedule(formattedData);

        // Extract unique doctor names for the dropdown
        const doctorNames = formattedData
            .filter(row => row.name && row.name !== 'Doctor Unavailable Today')
            .map(row => row.name);
        
        setDoctors([...new Set(doctorNames)]); // Remove duplicates
        
        const uniqueDates = formattedData
            .filter(row => row.date)
            .map(row => row.date);
        
        setDates([...new Set(uniqueDates)]); // Remove duplicates
    } catch (error) {
        console.error('Error fetching schedule:', error);
        setSchedule([]); // Ensure schedule is empty on error
        setDoctors([]); // Reset doctors
        setDates([]); // Reset dates
    }
};*/
    useEffect(() => {
        // Filter doctors based on the selected date
        const availableDoctors = schedule
            .filter(row => row.date === selectedDate)
            .map(row => row.name);

        setFilteredDoctors([...new Set(availableDoctors)]); // Remove duplicates
    }, [selectedDate, schedule]);

    useEffect(() => {
        if (selectedDate && selectedDoctor) {
            const selectedDoctorData = schedule.find(row => row.name === selectedDoctor && row.date === selectedDate);
            if (selectedDoctorData) {
                generateTimeSlots(selectedDoctorData);
            }
        }
    }, [selectedDoctor, selectedDate, schedule]);

    const generateTimeSlots = (doctorData) => {
        const timeRange = doctorData.time; // Example: "1:30-3:00"
        
        // Check if time range exists and is correctly formatted
        if (!timeRange || !timeRange.includes("-")) {
            console.error("Invalid time range:", timeRange);
            return;
        }
    
        const [startTime, endTime] = timeRange.split("-").map(time => time.trim());
    
        // Parse start and end times
        const start = new Date(`1970-01-01T${startTime.padStart(5, "0")}:00`); // Add leading zero if needed
        const end = new Date(`1970-01-01T${endTime.padStart(5, "0")}:00`);
        
        // Check if start and end are valid
        if (isNaN(start) || isNaN(end)) {
            console.error("Invalid start or end time:", start, end);
            return;
        }
        
        const slots = [];
        const slotDuration = doctorData.specialization === 'General Physician' ? 10 : 15; // Minutes
    
        // Generate slots
        for (let time = new Date(start); time < end; time.setMinutes(time.getMinutes() + slotDuration)) {
            const slotTime = time.toTimeString().slice(0, 5); // HH:MM format
            slots.push(slotTime);
        }
    
        // Check if slots were created successfully
        if (slots.length === 0) {
            console.warn("No slots generated for time range:", timeRange);
        } else {
            console.log("Generated slots:", slots); // Debugging
        }
    
        setTimeSlots(slots);
    };
    
    //search feature in the table
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const filteredMedicines = Patient.filter(medicine => {
        return Object.values(medicine).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const sortedEntries = [...filteredMedicines].sort((a, b) => {
        if (a.status === 'Pending' && b.status === 'Completed') return -1;
        if (a.status === 'Completed' && b.status === 'Pending') return 1;
        return 0;
    });
    const currentEntries = sortedEntries.slice(indexOfFirstEntry, indexOfLastEntry);
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Function to handle search term change
    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
    };
    
    
    return (
        <section id='userhome'>
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
              <Link className="dropdown-item d-flex align-items-center" to="/admin/profile">
                <i className="bi bi-person"></i>
                <span>My Profile</span>
              </Link>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <Link className="dropdown-item d-flex align-items-center" to="/admin/studentprofile">
                <i className="bi bi-gear"></i>
                <span>Account Settings</span>
              </Link>
            </Dropdown.Item>
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
        
        
        <div class='main' style={{
        background: 'linear-gradient(rgba(14, 29, 52, 0.86), rgba(14, 29, 52, 0.493))',
        backgroundPosition: 'center center',
        backgroundSize: 'cover', // Adjust as needed
        backgroundRepeat: 'no-repeat' // Adjust as needed
    }}>
            <div class="container">
                
                <h2 style={{color: 'white'}}>Cancel Medicine</h2>
                <table className="table table-responsive table-bordered table-hover" style= {{color: 'black'}}>
                    <thead>
                        <tr>
                            <th>Patient Name</th>
                            <th>Email Id</th>
                            <th>Date</th>
                            <th>Doctor Incharge</th>
                            <th>Medicine</th>
                            <th>Quantity</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map(patient => (
                            <React.Fragment key={patient._id}>
                                {patient.medicines.map((medicine, index) => (
                                    <tr key={`${patient._id}-${index}`}>
                                        {/* Only show the patient's information once if index is 0 */}
                                        <td>{index === 0 ? patient.name : ''}</td>
                                        <td>{index === 0 ? patient.email : ''}</td>
                                        <td>{index === 0 ? patient.date : ''}</td>
                                        <td>{index === 0 ? patient.doctor : ''}</td>

                                        {/* Display Medicine with Cancel Button if not cancelled */}
                                        <td style={{ opacity: medicine.cancelled ? 0.5 : 1 }}>
                                            <span>{medicine.name}</span>
                                            {!medicine.cancelled && !medicine.checked && ( // Only show Cancel button if not cancelled and checked is false
                                                <button 
                                                    className="btn btn-sm btn-danger ml-2"
                                                    onClick={() => handleCancelMedicine(patient._id, index)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                        <td>{medicine.qty}</td>
                                        <td>{index === 0 ? patient.status : ''}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <nav aria-label="Page navigation example">
                          {/*Pagination Feature that can help the user to navigate across different entries*/}
                          <ul className="pagination">
                            {Array.from({ length: Math.ceil(filteredMedicines.length / entriesPerPage) }, (_, index) => (
                              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                              </li>
                            ))}
                          </ul>
                        </nav>
                    <a href="https://docs.google.com/spreadsheets/d/1zouIz0bX8YG-UVBTwXXTreddsyR29TTPQL5pczmFKnw/edit?gid=0#gid=0"><em>Sheet link</em></a>
                
            </div>
        
            <div className="table-container">
                <table style={{color:'black', background:'white'}}>
                    <thead>
                        <tr>
                            <th>SI No</th>
                            <th>Name of Doctor</th>
                            <th>Qualification</th>
                            <th>Specialization</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((row, index) => (
                            <tr key={index}>
                                <td>{row.siNo}</td>
                                <td>{row.name}</td>
                                <td>{row.qualification}</td>
                                <td>{row.specialization}</td>
                                <td>{row.date}</td>
                                <td>{row.time}</td>
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

export default DoctorSchedule;

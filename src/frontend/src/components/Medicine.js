import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip } from 'bootstrap';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownButton, Badge, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import '../styles/admin.css';

import { useNavigate } from 'react-router-dom';

const Medicinedb = () => {
  const navigate = useNavigate();

  const [medicines, setMedicine] = useState([]);

  const [newMedicine, setNewMedicine] = useState({ name: '', form: '', strength: '', instructions: '', category: ''});


  useEffect(() => {
    fetchMedicines();
  }, []);

//Function to retrieve database information
  const fetchMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/medicinedb');
      setMedicine(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

   // Function to handle form input changes
   const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMedicine({ ...newMedicine, [name]: value });
  };
  const handleDateChange = (date, name) => {
    setNewMedicine((prev) => ({ ...prev, [name]: date }));
  };


    const handleSubmit = async (e) => {
      e.preventDefault();
    
      
      
      if (!newMedicine.name || !newMedicine.form ||!newMedicine.strength || !newMedicine.instructions || !newMedicine.category ) {
        alert('Please fill in all fields.');
        return;
      }
    
      
      try {
        console.log('New Medicine data:', newMedicine);
        
        const response2 = await axios.get(`http://localhost:5000/api/medicinedb/search?category=id&keyword=${newMedicine.id}`);
        console.log("Search response:", response2);
    
        if (!response2.data || response2.data.length === 0) {
          const response = await axios.post('http://localhost:5000/api/medicinedb', newMedicine);
          console.log('Medicine added:', response.data);
    
          setNewMedicine({
            name: '', 
            form: '', 
            strength: '', 
            instructions: '', 
            category: '', 
          });
    
          fetchMedicines();
          window.location.reload(); 
        } else {        
          throw new Error("Roll Number exists in the database.");
        }
      } catch (error) {
        console.error('Error adding entry:', error);
        if (error.response && error.response.data) {
          // Display backend error message if available
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert('Error adding entry.');
        }
      }
    };
    
  //function to delete any user
  const handleDeleteMedicine = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/medicinedb/${id}`);
      setMedicine(medicines.filter(medicine => medicine._id !== id));
      fetchMedicines(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  //search feature in the table
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const filteredMedicines = medicines.filter(medicine => {
    return Object.values(medicine).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredMedicines.slice(indexOfFirstEntry, indexOfLastEntry);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle search term change
  const handleSearchChange = e => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => {
      return new Tooltip(tooltipTriggerEl);
    });
  }, []);
// State to manage sidebar toggle
const [isSidebarToggled, setIsSidebarToggled] = useState(false);

// Effect to add event listener for the toggle button
useEffect(() => {
const toggleSidebar = () => {
  setIsSidebarToggled(prevState => !prevState);
};

const toggleButton = document.querySelector('.toggle-sidebar-btn');
if (toggleButton) {
  toggleButton.addEventListener('click', toggleSidebar);
}

// Cleanup function to remove the event listener
return () => {
  if (toggleButton) {
    toggleButton.removeEventListener('click', toggleSidebar);
  }
};
}, []);

// Effect to add or remove 'toggle-sidebar' class on the body element
useEffect(() => {
if (isSidebarToggled) {
  document.body.classList.add('toggle-sidebar');
} else {
  document.body.classList.remove('toggle-sidebar');
}
}, [isSidebarToggled]);
useEffect(() => {
// Sticky header on scroll
const selectHeader = document.querySelector('#header');

const handleScroll = () => {
  if (selectHeader) {
    window.scrollY > 100 ? selectHeader.classList.add('sticked') : selectHeader.classList.remove('sticked');
  }
};

document.addEventListener('scroll', handleScroll);
}, []);
// useEffect hook to handle side effects
useEffect(() => {
  // Select the mobile navigation toggle button
  const mobileNavToogleButton = document.querySelector('.mobile-nav-toggle');

  if (mobileNavToogleButton) {
    mobileNavToogleButton.addEventListener('click', (event) => {
      event.preventDefault();
      mobileNavToogle();
    });
  }
  // Function to toggle mobile navigation
  const mobileNavToogle = () => {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToogleButton.classList.toggle('bi-three-dots:');
    mobileNavToogleButton.classList.toggle('bi-x');
  };
  // Add event listeners to navigation links
  document.querySelectorAll('#navbar a').forEach((navbarlink) => {
    if (!navbarlink.hash) return;

    const section = document.querySelector(navbarlink.hash);
    if (!section) return;

    navbarlink.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });
  });
// Add event listeners to navigation dropdowns
  const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

  navDropdowns.forEach((el) => {
    el.addEventListener('click', function (event) {
      if (document.querySelector('.mobile-nav-active')) {
        event.preventDefault();
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('dropdown-active');

        const dropDownIndicator = this.querySelector('.dropdown-indicator');
        dropDownIndicator.classList.toggle('bi-chevron-up');
        dropDownIndicator.classList.toggle('bi-chevron-down');
      }
    });
  });
// Cleanup function to remove event listeners
  return () => {
    if (mobileNavToogleButton) {
      mobileNavToogleButton.removeEventListener('click', (event) => {
        event.preventDefault();
        mobileNavToogle();
      });
    }

    document.querySelectorAll('#navbar a').forEach((navbarlink) => {
      if (!navbarlink.hash) return;

      const section = document.querySelector(navbarlink.hash);
      if (!section) return;

      navbarlink.removeEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle();
        }
      });
    });

    navDropdowns.forEach((el) => {
      el.removeEventListener('click', function (event) {
        if (document.querySelector('.mobile-nav-active')) {
          event.preventDefault();
          this.classList.toggle('active');
          this.nextElementSibling.classList.toggle('dropdown-active');

          const dropDownIndicator = this.querySelector('.dropdown-indicator');
          dropDownIndicator.classList.toggle('bi-chevron-up');
          dropDownIndicator.classList.toggle('bi-chevron-down');
        }
      });
    });
  };
}, []);

  //reponsive view of navigation bar in smaller sized window
useEffect(() => {
  const mobileNavToggleButtons = document.querySelectorAll('.mobile-nav-toggle');
  const mobileNavShow = document.querySelector('.mobile-nav-show');
  const mobileNavHide = document.querySelector('.mobile-nav-hide');
  
  function mobileNavToggle() {
    document.body.classList.toggle('mobile-nav-active');
    mobileNavShow.classList.toggle('d-none');
    mobileNavHide.classList.toggle('d-none');
  }
  
  mobileNavToggleButtons.forEach(button => {
    button.addEventListener('click', mobileNavToggle);
  });
  
  return () => {
    mobileNavToggleButtons.forEach(button => {
      button.removeEventListener('click', mobileNavToggle);
    });
  };
}, []); 

  return (
    <div>
              <section id="admin">
                {/*--------Header section: contains navigation tab and institute logo--------*/}
      <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="container-fluid container-xl d-flex align-items-center justify-content-between" >
            <div className="logo d-flex align-items-center">
              <img src="/static/logo.svg.png" alt="IIT Dharwad Logo" />
              <h1>IIT Dharwad</h1>
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
        
        <main id="main" className="main" style={{ height: '100vh', width: '100%' }}>
          <div className="pagetitle">
            <h1>Medicine Data</h1>
            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item" style={{ color: "#ccc" }}>
                  <Link style={{ color: "#ccc" }} to="/admin">Home</Link>
                </li>
                <li className="breadcrumb-item active" style={{ color: "#ccc" }}>Medicine Database</li>
              </ol>
            </nav>
          </div>
          <section className="section">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body pt-3">
                    <ul className="nav nav-tabs nav-tabs-bordered">
                      <li className="nav-item">
                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Medicine Data</button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Add Entry</button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#profile-settings">Delete Entry</button>
                      </li>
                    </ul>
                    <div className="tab-content pt-2">
                      <div className="tab-pane fade show active profile-overview" id="profile-overview">
                      <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search by title ..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <select
                    className="form-control"
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
                  >
                    <option value="5">5 entries per page</option>
                    <option value="10">10 entries per page</option>
                    <option value={filteredMedicines.length}>All entries</option>
                  </select>
                </div>
                          <div className="table-responsive-wrapper">
                          <table className="table table-responsive table-bordered table-hover">
                          <thead>
                            <tr>
                              <th>Medicine Name</th>
                              <th>Form</th>
                              <th>Strength</th>
                              <th>Instructions</th>
                              <th>Category</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentEntries.map(medicine => (
                              <tr key={medicine._id}>
                                <td>{medicine.name}</td>
                                <td>{medicine.form}</td>
                                <td>{medicine.strength}</td>
                                <td>{medicine.instructions}</td>
                                <td>{medicine.category}</td>                     
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                        <div>
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
                      </div>
                      </div>

                      <div className="tab-pane fade profile-edit pt-3" id="profile-edit">
                        <div className="row">
                          <div className="card">
                            <div className="card-body">
                              <h5 className="card-title">Add Entry</h5>
                              <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                  <label htmlFor="name" className="form-label">Medicine Name</label>
                                  <input type="text" className="form-control" id="name" name="name" value={newMedicine.name} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="form" className="form-label">Medicine Form</label>
                                  <input type="text" className="form-control" id="form" name="form" value={newMedicine.form} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="strength" className="form-label">Strength</label>
                                  <input type="text" className="form-control" id="strength" name="strength" value={newMedicine.strength} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="instructions" className="form-label">Instructions</label>
                                  <input type="text" className="form-control" id="instructions" name="instructions" value={newMedicine.instructions} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="category" className="form-label">Category</label>
                                  <input type="text" className="form-control" id="category" name="category" value={newMedicine.category} onChange={handleChange} />
                                </div>                            
                                <button type="submit" className="btn btn-primary">Submit</button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="tab-pane fade pt-3" id="profile-settings">
                        <h6>Delete Entry</h6>
                        <div className="search-container">
                      <input
                        type="text"
                        placeholder="Search by title ..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <select
                        className="form-control"
                        value={entriesPerPage}
                        onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
                      >
                        <option value="5">5 entries per page</option>
                        <option value="10">10 entries per page</option>
                        <option value={filteredMedicines.length}>All entries</option>
                      </select>
                    </div>
                    {/*Table Columns*/}
                          <div className="table-responsive-wrapper">
                          <table className="table table-responsive table-bordered table-hover">
                          <thead>
                            <tr>
                              <th>Medicine Name</th>
                              <th>Form</th>
                              <th>Strength</th>
                              <th>Instructions</th>
                              <th>Category</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentEntries.map(medicine => (
                              <tr key={medicine._id}>
                                <td>{medicine.name}</td>
                                <td>{medicine.form}</td>
                                <td>{medicine.strength}</td>
                                <td>{medicine.instructions}</td>
                                <td>{medicine.category}</td>
                                
                                <td>
                                  <button className="btn btn-danger" onClick={() => handleDeleteMedicine(medicine._id)}>Delete</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        </div>
                        <div>
                  <nav aria-label="Page navigation example">
                    <ul className="pagination">
                      {Array.from({ length: Math.ceil(filteredMedicines.length / entriesPerPage) }, (_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => paginate(index + 1)}>{index + 1}</button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
                      </div>

                    </div>
                  </div>
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
    </div>
  );
};

export default Medicinedb;

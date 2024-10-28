import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tooltip } from 'bootstrap';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownButton, Badge, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/admin.css';

import { useNavigate } from 'react-router-dom';

const PendingMedicines = () => {
  const navigate = useNavigate();

  const [Patient, setPatient] = useState([]);

  const [newPatient, setNewPatient] = useState({ name: '', email: '', date: '', doctor: '', medicines: [{ name: '', qty: '', checked: false }], status: ''});

  const handleCheck = (patientId, medicineIndex) => {
    setPatient(prevEntries =>
      prevEntries.map(patient => {
          if (patient._id === patientId) {
              const updatedMedicines = patient.medicines.map((medicine, index) => {
                  if (index === medicineIndex) {
                      return { ...medicine, checked: !medicine.checked };
                  }
                  return medicine;
              });
              // Update status based on whether all medicines are checked
              const allChecked = updatedMedicines.every(med => med.checked);
              const updatedPatient = { ...patient, medicines: updatedMedicines, status: allChecked ? 'Completed' : 'Pending' };

        // Update the database with the modified patient entry
        updatePatientInDatabase(patientId, updatedPatient);

        return updatedPatient;
          }
          return patient;
      })
  );
};
const updatePatientInDatabase = async (patientId, updatedPatient) => {
  try {
    await axios.put(`http://localhost:5000/api/pendingdb/${patientId}`, updatedPatient); 
  } catch (error) {
    console.error('Error updating patient:', error);
  }
};


  useEffect(() => {
  fetchPatients();
  }, []);

//Function to retrieve database information
  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pendingdb');
      setPatient(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

   // Function to handle form input changes
   const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };
  const handleDateChange = (date, name) => {
    setNewPatient((prev) => ({ ...prev, [name]: date }));
  };
  const handleMedicineCheck = (index) => {
    // Toggle the checked state of the selected medicine
    const updatedMedicines = newPatient.medicines.map((med, idx) => 
      idx === index ? { ...med, checked: !med.checked } : med
    );
    setNewPatient({ ...newPatient, medicines: updatedMedicines });
  };

  
  // Add a new medicine row
  const addMedicineRow = () => {
    setNewPatient((prev) => ({
      ...prev,
      medicines: [...prev.medicines, { name: '', qty: '', checked: false }],
    }));
  };
  
  // Remove a medicine row
  const removeMedicineRow = (index) => {
    setNewPatient((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index),
    }));
  };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      
      
      if (!newPatient.name || !newPatient.email ||!newPatient.date || !newPatient.doctor ||newPatient.medicines.length === 0) {
        alert('Please fill in all fields.');
        return;
      }
      
      const allMedicinesChecked = newPatient.medicines.every(med => med.checked);
      const status = allMedicinesChecked ? 'Completed' : 'Pending';

      
      try {
        console.log('New Patient data:', { ...newPatient, status });
        
       const response = await axios.post('http://localhost:5000/api/pendingdb', { ...newPatient, status });
          console.log('Patient added:', response.data);
    
          setNewPatient({
            name: '', 
            email: '', 
            date: '', 
            doctor: '', 
            medicines: [{ name: '', qty: '', checked: false }],
            status:'',
          });
    
          fetchPatients();
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
        <div className="container-fluid container-xl d-flex align-items-center justify-content-between">
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
        
        <main id="main" className="main" style={{ height: '90vh', width: '100%', marginBottom: '10cm' }}>
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
                                <td>{index === 0 ? patient.name : ''}</td>
                                <td>{index === 0 ? patient.email : ''}</td>
                                <td>{index === 0 ? patient.date : ''}</td>
                                <td>{index === 0 ? patient.doctor : ''}</td>
                                <td style={{ opacity: medicine.checked ? 0.5 : 1 }}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={medicine.checked}
                                            onChange={() => handleCheck(patient._id, index)}
                                        />
                                        {medicine.name}
                                    </label>
                                </td>
                                <td>{medicine.qty}</td>
                                <td>{index === 0 ? patient.status : ''}</td>
                            </tr>
                        ))}
                    </React.Fragment>
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
                                  <label htmlFor="name" className="form-label">Patient Name</label>
                                  <input type="text" className="form-control" id="name" name="name" value={newPatient.name} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                  <label htmlFor="email" className="form-label">Patient Email Id</label>
                                  <input type="text" className="form-control" id="email" name="email" value={newPatient.email} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="date" className="form-label">Date</label>
                                    <input
                                      type="date"  
                                      className="form-control"
                                      id="date"
                                      name="date"
                                      value={newPatient.date}
                                      onChange={handleChange}
                                    />
                                  </div>


                                <div className="mb-3">
                                  <label htmlFor="doctor" className="form-label">Doctor Incharge</label>
                                  <input type="text" className="form-control" id="doctor" name="doctor" value={newPatient.doctor} onChange={handleChange} />
                                </div>
                                <label className="form-label">Medicines</label>
                                {newPatient.medicines.map((medicine, index) => (
                                  <div key={index}>
                                    <input 
                                      type="text" 
                                      placeholder="Medicine Name" 
                                      value={medicine.name} 
                                      onChange={(e) => {
                                        const updatedMedicines = [...newPatient.medicines];
                                        updatedMedicines[index].name = e.target.value;
                                        setNewPatient({ ...newPatient, medicines: updatedMedicines });
                                      }}
                                    />
                                    <input 
                                      type="number" 
                                      placeholder="Quantity" 
                                      value={medicine.qty} 
                                      onChange={(e) => {
                                        const updatedMedicines = [...newPatient.medicines];
                                        updatedMedicines[index].qty = e.target.value;
                                        setNewPatient({ ...newPatient, medicines: updatedMedicines });
                                      }}
                                    />
                                    <input 
                                      type="checkbox" 
                                      checked={medicine.checked} 
                                      value={medicine.checked} 
                                      onChange={() => handleMedicineCheck(index)}
                                    />
                                    <button type="button" className="btn btn-danger" onClick={() => removeMedicineRow(index)} style={{color:'black'}}>Remove</button>
                                    
                                  </div>
                                ))}
                                    <button type="button" className="btn btn-secondary mb-3" onClick={addMedicineRow} style={{color:'black'}}>
                                      Add Medicine
                                    </button>                    
                                                
                                <button type="submit" className="btn btn-primary">Submit</button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
      </section>
    </div>
  );
};

export default PendingMedicines;

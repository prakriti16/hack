import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import '../styles/style_home.css';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBIcon
  }
  from 'mdb-react-ui-kit';
  

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    roll: '',
    email: '',
    branch: '',
    password: '',
    position: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Attempt to send form data to the registration endpoint
      const response = await axios.post('http://localhost:5000/api/register', formData);
      if (response.status === 201) { // Assuming 201 is returned upon successful registration
        alert('Registration successful!');
        navigate('/login'); // Redirect to login page after registration
      }
    } catch (error) {
      // If there are validation errors from backend, set error messages
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <section id="register-page">
        <div className="register-card">
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.name && <p className="text-danger">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="roll">Roll Number</label>
          <input
            type="text"
            id="roll"
            name="roll"
            value={formData.roll}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.roll && <p className="text-danger">{errors.roll}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.email && <p className="text-danger">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="branch">Branch</label>
          <input
            type="text"
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.branch && <p className="text-danger">{errors.branch}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
          {errors.password && <p className="text-danger">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="position">Position</label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Position</option>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
          </select>
          {errors.position && <p className="text-danger">{errors.position}</p>}
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
      </form>
      <p className="mt-3">
        Already registered?{' '}
        <a onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#608dfd' }}>
          Sign In
        </a>
      </p>
    </div>
    </div>
    </section>
  );
};

export default Registration;

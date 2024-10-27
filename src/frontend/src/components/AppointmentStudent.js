import React, { useEffect, useState } from 'react';
import '../styles/User.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
const AppointmentStudent = () => {
    const [appointments, setAppointments] = useState([]);
    const [trafficLevel, setTrafficLevel] = useState('Low');
    const [profile, setProfile] = useState({});
    useEffect(() => {
        const fetchProfile = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/register/profile', {
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
            const response = await fetch('http://localhost:5000/api/userappointments');
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
          const response = await axios.delete(`http://localhost:5000/api/${encodeURIComponent(email)}/${encodeURIComponent(timeSlot)}`);
          fetchAppointments();
        } catch (error) {
          console.error('Error deleting item:', error);
        }
      };
    
    return (
        <section id="userhome">
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
                <strong>Traffic Level:</strong> {trafficLevel === 'High' && <span style={{ color: 'red' }}>High Traffic</span>}
                {trafficLevel === 'Medium' && <span style={{ color: 'orange' }}>Medium Traffic</span>}
                {trafficLevel === 'Low' && <span style={{ color: 'green' }}>Low Traffic</span>}
            </div>
            <table border="1" style={{ width: '100%', textAlign: 'left' }}>
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
        
              
        
        </section>
    
    );
};

export default AppointmentStudent;

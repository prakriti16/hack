import logo from './logo.svg';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminPage from './components/AdminPage.js';
import Medicine from './components/Medicine.js';
import PendingMedicines from './components/PendingMeds.js';
import AppointmentAdmin from './components/AppointmentAdmin.js';
import AppointmentStudent from './components/AppointmentStudent.js';
import './App.css';
import Login from './components/Login';
import User from './components/User';
import BookAppointment from './components/BookAppointment';
import { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Footer } from "./components/Footer";
import Registration from './components/Register.js';
import { Map } from "./components/Map"
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <Router>
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/medicine" element={<Medicine />} />
        <Route path="/admin/pendingmeds" element={<PendingMedicines />} />
        <Route path="/admin/appointment" element={<AppointmentAdmin />} />
        <Route path="/Userpage" element={<User />} />
        <Route path="/Userpage/BookAppointment" element={<BookAppointment />} />
        <Route path="/Userpage/appointment" element={<AppointmentStudent />} />
        <Route path="/" element={
          <div>
            <Navigation />
            <Header data={landingPageData.Header} />
            <About data={landingPageData.About} />
            <Services data={landingPageData.Services} />
            <Testimonials data={landingPageData.Testimonials} />
            <Team data={landingPageData.Team} />
            <Map data={landingPageData.Map} />
            <Footer data={landingPageData.Contact} />
          </div>
        } />
      </Routes>
    </Router>
  );
};



export default App;

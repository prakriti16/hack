const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
const dbURI = process.env.MONGO_URI; // Use environment variable for MongoDB URI
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const medicineRoute = require('./routes/medicinedb');
const pendingRoute = require('./routes/pendingdb');
const loginRoute = require('./routes/loginroute');
app.use('/api/medicinedb', medicineRoute);
app.use('/api/pendingdb', pendingRoute);
app.use('/api/register', loginRoute);

// Appointment Schema and Model
const appointmentSchema = new mongoose.Schema({
    email: String,
    doctorName: String,
    timeSlot: String,
    date: String,
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Google Sheets API Setup
const SPREADSHEET_ID = '1zouIz0bX8YG-UVBTwXXTreddsyR29TTPQL5pczmFKnw';
const RANGE = 'Sheet1!A1:F100';
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(Buffer.from(process.env.GOOGLE_CLOUD_CREDENTIALS, 'base64').toString('utf-8')),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets('v4');

// API Endpoints
app.get('/api/schedule', async (req, res) => {
    try {
        const authClient = await auth.getClient();
        const response = await sheets.spreadsheets.values.get({
            auth: authClient,
            spreadsheetId: SPREADSHEET_ID,
            range: RANGE,
        });
        res.json(response.data.values);
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error.message);
        res.status(500).json({ error: 'Error fetching data', details: error.message });
    }
});

// CRUD Operations for Appointments
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

app.get('/api/userappointments', async (req, res) => {
    const { email } = req.query;
    try {
        const appointments = email ? await Appointment.find({ email }) : await Appointment.find();
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

app.post('/api/book-appointment', async (req, res) => {
    const { email, doctorName, timeSlot, date } = req.body;
    try {
        const existingAppointmentForUser = await Appointment.findOne({ email, doctorName, date });
        if (existingAppointmentForUser) {
            return res.status(400).json({ error: 'You already have an appointment with this doctor on this date.' });
        }

        const existingAppointmentForSlot = await Appointment.findOne({ doctorName, date, timeSlot });
        if (existingAppointmentForSlot) {
            return res.status(400).json({ error: 'This time slot is already booked for the selected doctor.' });
        }

        const newAppointment = new Appointment({ email, doctorName, timeSlot, date });
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error saving appointment:', error);
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});

app.delete('/api/:email/:timeSlot', async (req, res) => {
    const { email, timeSlot } = req.params;
    try {
        const deletedIssue = await Appointment.findOneAndDelete({ email: decodeURIComponent(email), timeSlot: decodeURIComponent(timeSlot) });
        if (!deletedIssue) return res.status(404).json({ message: 'Entry not found' });
        res.json({ message: 'Entry deleted' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: err.message });
    }
});
app.get('/', (req, res) => {
  res.send("Welcome to the API");
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});

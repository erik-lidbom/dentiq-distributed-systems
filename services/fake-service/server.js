const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Data
const clinics = [
    {
        id: 1,
        name: "Dentiq Clinic",
        lat: 57.7089,
        lng: 11.9746,
        address: "123 Main St, Gothenburg",
        phone: "031 123 456",
        services: ["General Dentistry", "Orthodontics"],
        firstAvailableTime: "2024-12-20",
        languages: ["English", "Svenska"],
        dentists: [
            {
                id: "1",
                name: "Nabil Al Sayed",
                speciality: "General Dentistry",
                languages: ["English", "Svenska", "العربية"],
                availability: [
                    { date: "2024-11-10", times: ["09:30 AM", "10:30 AM", "11:30 AM"] },
                    { date: "2024-11-12", times: ["10:00 AM", "11:00 AM", "01:00 PM"] },
                ],
            },
            {
                id: "2",
                name: "Erik Lidbom",
                speciality: "Orthodontics",
                languages: ["English", "Svenska"],
                availability: [
                    { date: "2024-11-11", times: ["09:00 AM", "10:30 AM", "11:30 AM"] },
                    { date: "2024-11-13", times: ["10:00 AM", "12:30 PM"] },
                ],
            },
            {
                id: "3",
                name: "Lilly Hier",
                speciality: "General Dentistry",
                languages: ["English", "Svenska", "Spanish"],
                availability: [
                    { date: "2024-11-11", times: ["09:00 AM", "10:30 AM", "11:30 AM"] },
                    { date: "2024-11-13", times: ["10:00 AM", "12:30 PM"] },
                ],
            },
        ],
    },
    {
        id: 2,
        name: "Smile Dental",
        lat: 57.7001,
        lng: 11.9668,
        address: "456 Elm St, Gothenburg",
        phone: "031 654 321",
        services: ["Oral Surgery", "Pediatric Dentistry", "Endodontics", "Prosthodontics"],
        firstAvailableTime: "2025-02-23",
        languages: ["English", "Svenska", "Spanish"],
        dentists: [
            {
                id: "3",
                name: "Utkarsh",
                speciality: "Pediatric Dentistry",
                languages: ["English"],
                availability: [
                    { date: "2024-11-14", times: ["09:30 AM", "10:30 AM", "01:30 PM"] },
                    { date: "2024-11-16", times: ["10:00 AM", "11:30 AM", "12:30 PM"] },
                ],
            },
        ],
    },
];

// Endpoints

// Fetch all clinics
app.get('/api/clinics', (req, res) => {
    res.json(clinics);
});

// Fetch a specific clinic by ID
app.get('/api/clinics/:id', (req, res) => {
    const clinicId = parseInt(req.params.id, 10);
    const clinic = clinics.find((c) => c.id === clinicId);
    if (clinic) {
        res.json(clinic);
    } else {
        res.status(404).json({ error: "Clinic not found" });
    }
});

// Fetch doctors for a specific clinic
app.get('/api/clinics/:id/doctors', (req, res) => {
    const clinicId = parseInt(req.params.id, 10);
    const clinic = clinics.find((c) => c.id === clinicId);
    if (clinic) {
        res.json(clinic.doctors);
    } else {
        res.status(404).json({ error: "Clinic not found" });
    }
});

// Fetch availability of a specific doctor
app.get('/api/clinics/:clinicId/doctors/:doctorId/availability', (req, res) => {
    const clinicId = parseInt(req.params.clinicId, 10);
    const doctorId = req.params.doctorId;
    const clinic = clinics.find((c) => c.id === clinicId);

    if (clinic) {
        const doctor = clinic.doctors.find((d) => d.id === doctorId);
        if (doctor) {
            res.json(doctor.availability);
        } else {
            res.status(404).json({ error: "Doctor not found" });
        }
    } else {
        res.status(404).json({ error: "Clinic not found" });
    }
});

// Filter clinics by city or distance (mock implementation)
app.get('/api/clinics/filter', (req, res) => {
    const { city, maxDistance } = req.query;
    // This is a mock filter; real implementation would require geo-location calculations.
    if (city) {
        const filteredClinics = clinics.filter((c) => c.address.includes(city));
        return res.json(filteredClinics);
    }
    if (maxDistance) {
        // Mock distance filtering logic (hardcoded)
        return res.json(clinics.slice(0, parseInt(maxDistance, 10)));
    }
    res.json(clinics);
});

// Login endpoint (for testing)
app.get('/api/login', (req, res) => {
    res.send(`Login success! Welcome!`);
});

// Start Server
app.listen(3000, () => {
    console.log('Mock server is running on http://localhost:3000');
});

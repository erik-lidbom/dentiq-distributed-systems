const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const clinics = [
    {
      id: 1,
      name: "Dentiq Clinic",
      lat: 57.7089,
      lng: 11.9746,
      address: "123 Main St",
      services: ["Dentist", "Orthodontist", "Endodontist"],
    },
    {
      id: 2,
      name: "Smile Dental",
      lat: 57.7001,
      lng: 11.9668,
      address: "456 Elm St",
      services: ["Dentist", "Orthodontist", "Endodontist", "Oral Surgeon", "Pediatric Dentist", "Periodontist", "Prosthodontist"],
    },
  ];


app.get('/', (req, res) => {
    res.send(clinics);
    }
);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);

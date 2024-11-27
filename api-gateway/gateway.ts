import express from 'express';
import { Request, Response } from 'express';


const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const routes = require('./routes');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

const clinics = [
    {
      id: 1,
      name: "Dentiq Clinic",
      lat: 57.7089,
      lng: 11.9746,
      address: "123 Main St",
      services: ["Dentist", "Orthodontist", "Endodontist"],
      firstAvailableTime: "2024 Dec 22",
      dentists: ["950202-1231", "900202-1232", "930202-1233", "940202-1234", "960202-1235", "970202-1236", "980202-1237"]
    },
    {
      id: 2,
      name: "Smile Dental",
      lat: 57.7001,
      lng: 11.9668,
      address: "456 Elm St",
      services: ["Dentist", "Orthodontist", "Endodontist", "Oral Surgeon", "Pediatric Dentist", "Periodontist", "Prosthodontist"],
      firstAvailableTime: "2024 Dec 22",
      dentists: ["820402-1421", "830402-1422", "840402-1423", "850402-1424", "860402-1425", "870402-1426", "880402-1427"]
    },
  ];


app.get('/', (req : Request, res : Response) => {
    res.send(clinics);
    }
);

app.listen(PORT, () => {
    console.log(`GATEWAY is listening at http://localhost:${PORT}`);
    }
);

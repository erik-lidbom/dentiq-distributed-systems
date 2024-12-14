import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { getService } from '../services/serviceRegistery';
import { ServiceError } from '../utils/customError'; // Custom Error Classes

const routingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serviceName, path } = req.params;
    const service = getService(serviceName);

    if (!service) {
      throw new ServiceError(`Service ${serviceName} not found`, 404);
    }

    // Construct target URL dynamically
    let targetUrl = service.url;

    if (path) {
      targetUrl += `/${path}`;
    }

    // Append query parameters if present
    const queryString = Object.entries(req.query)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
      )
      .join('&');

    if (queryString) {
      targetUrl += `?${queryString}`;
    }

    console.log(
      `[INFO]: Forwarding request ${req.method} ${req.url} to: ${targetUrl}`
    );

    // TODO: Remove line 42-47 when connected with the real services
    const data = req.body || {};
    return res
      .status(200)
      .json({ message: `Request forwarded to ${serviceName}`, data });
    // remove till this line

    // Forward the request to the target service
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: req.headers,
    });

    res.status(response.status).send(response.data);
  } catch (error: any) {
    if (error.response) {
      // Backend service error
      console.error(
        `[ERROR]: Backend service error. Service: ${req.params.serviceName}, URL: ${error.config.url}, Status: ${error.response.status}`
      );
      return next(
        new ServiceError(
          `Error from service ${req.params.serviceName}: ${error.response.data.message || 'Unknown error'}`,
          error.response.status
        )
      );
    }

    console.error(
      `[ERROR]: Internal error in routingController: ${error.message}`
    );
    next(new ServiceError('Internal Server Error', 500));
  }
};

const aggregateClinics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Mock data for dentists
    const mockDentists = [
      {
        id: '1',
        firstName: 'Nabil',
        lastName: 'Al Sayed',
        speciality: 'Prosthodontist',
        languages: ['English', 'Svenska', 'العربية'],
        availability: [
          { date: '2024-12-29', times: ['09:30 AM', '10:30 AM', '11:30 AM'] },
          { date: '2025-01-12', times: ['10:00 AM', '11:00 AM', '01:00 PM'] },
        ],
        clinics: [
          {
            id: '1',
            name: 'Dentiq Clinic',
            lat: 57.7089,
            lng: 11.9746,
            address: '123 Main St, Gothenburg',
            phone: '031 123 456',
            services: ['Prosthodontist', 'Pediatric Dentist'],
          },
        ],
      },
      {
        id: '2',
        firstName: 'Erik',
        lastName: 'Lidbom',
        speciality: 'Pediatric Dentist',
        languages: ['English', 'Italian', 'Mandarin'],
        availability: [
          { date: '2024-12-28', times: ['09:00 AM', '10:30 AM', '11:30 AM'] },
          { date: '2024-12-15', times: ['10:00 AM', '12:30 PM'] },
        ],
        clinics: [
          {
            id: '1',
            name: 'Dentiq Clinic',
            lat: 57.7089,
            lng: 11.9746,
            address: '123 Main St, Gothenburg',
            phone: '031 123 456',
            services: ['Prosthodontist', 'Pediatric Dentist'],
          },
        ],
      },
      {
        id: '3',
        firstName: 'Lilly',
        lastName: 'Hier',
        speciality: 'General Dentistry',
        languages: ['English', 'Svenska', 'Spanish', 'Portuguese'],
        availability: [
          { date: '2024-01-03', times: ['09:00 AM', '10:30 AM', '11:30 AM'] },
          { date: '2024-12-18', times: ['10:00 AM', '12:30 PM'] },
        ],
        clinics: [
          {
            id: '2',
            name: 'Smile Dental',
            lat: 57.7001,
            lng: 11.9668,
            address: '456 Elm St, Gothenburg',
            phone: '031 654 321',
            services: ['Oral Surgeon', 'Dentist', 'Prosthodontist'],
          },
        ],
      },
    ];

    // Map to aggregate clinics
    const clinicsMap: Record<string, any> = {};

    mockDentists.forEach((dentist) => {
      dentist.clinics.forEach((clinic) => {
        if (!clinicsMap[clinic.id]) {
          clinicsMap[clinic.id] = {
            id: clinic.id,
            name: clinic.name,
            lat: clinic.lat,
            lng: clinic.lng,
            address: clinic.address,
            phone: clinic.phone,
            services: clinic.services || [],
            firstAvailableTime: null,
            languages: new Set(),
            dentists: [],
          };
        }

        clinicsMap[clinic.id].dentists.push({
          id: dentist.id,
          name: `${dentist.firstName} ${dentist.lastName}`,
          speciality: dentist.speciality,
          languages: dentist.languages || [],
          availability: dentist.availability || [],
        });

        // Add dentist languages to the clinic languages set
        dentist.languages?.forEach((lang) =>
          clinicsMap[clinic.id].languages.add(lang)
        );

        // Compute the first available time for the clinic
        dentist.availability?.forEach((availability) => {
          const availableDate = new Date(availability.date);
          const currentFirstAvailable = clinicsMap[clinic.id].firstAvailableTime
            ? new Date(clinicsMap[clinic.id].firstAvailableTime)
            : null;

          if (!currentFirstAvailable || availableDate < currentFirstAvailable) {
            clinicsMap[clinic.id].firstAvailableTime = availability.date;
          }
        });
      });
    });

    // Convert Set back to Array for languages and map to an array of clinics
    const clinics = Object.values(clinicsMap).map((clinic: any) => ({
      ...clinic,
      languages: Array.from(clinic.languages),
    }));

    res.status(200).json(clinics);
  } catch (error: any) {
    console.error(`[ERROR]: Failed to aggregate clinics - ${error.message}`);
    next(new ServiceError('Failed to aggregate clinics', 500));
  }
};

export { routingController, aggregateClinics };

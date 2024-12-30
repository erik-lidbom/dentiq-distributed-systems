import { services } from '@/constants/directory';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

/**
 * Fetch all data from the API gateway
 * @returns {Promise<Object[]>} - List of clinics including all necessary data
 */

export const fetchData = async () => {
  try {
    const data = {
      appointments: [],
      clinics: [],
      dentists: [],
    };

    const bookingRes = await axios
      .get(`${BASE_URL}/booking/query`)
      .then((res) => res.data);

    data.appointments = bookingRes.data || [];

    const clinicRes = await axios
      .get(`${BASE_URL}/clinic/query`)
      .then((res) => res.data);

    data.clinics = clinicRes.data || [];

    const dentistRes = await axios
      .get(`${BASE_URL}/dentist/query`)
      .then((res) => res.data);

    data.dentists = dentistRes.data || [];

    console.log(
      ' Appointments: ',
      data.appointments,
      ' Clinics: ',
      data.clinics,
      ' Dentists: ',
      data.dentists
    );

    console.log('Data fetched successfully:', data);

    // Process and aggregate data as needed
    return { data };
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

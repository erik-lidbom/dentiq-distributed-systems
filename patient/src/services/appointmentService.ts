import { logout } from '@/utils/helpers';

const BASE_URL = 'http://localhost:4000/api/booking';

/**
 * Fetch clinics from the API gateway
 * @returns {Promise<Object[]>} - List of clinics
 */

export async function bookAppointment(body: any): Promise<any> {
  try {
    const token = localStorage.getItem('token');
    // Post an appointment
    const response = await fetch(`${BASE_URL}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      throw new Error(`Error posting appointment: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Appointment posted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error posting appointment:', error);
    throw error;
  }
}

export async function getAppointments(): Promise<any> {
  const token = localStorage.getItem('token');
  try {
    // Get all appointments
    const response = await fetch(`${BASE_URL}/query`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      logout();
      return;
    }

    if (!response.ok) {
      throw new Error(`Error fetching appointments: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Appointments fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
}

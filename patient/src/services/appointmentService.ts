const BASE_URL = 'http://localhost:3000/api/booking';

/**
 * Fetch clinics from the API gateway
 * @returns {Promise<Object[]>} - List of clinics
 */

export async function bookAppointment(body: any): Promise<any> {
  try {
    // Post an appointment
    const response = await fetch(`${BASE_URL}/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

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
  try {
    // Get all appointments
    const response = await fetch(`${BASE_URL}/query`, {
      method: 'GET',
    });

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

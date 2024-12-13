const BASE_URL = 'http://localhost:3000/api/clinics';

/**
 * Fetch clinics from the API gateway
 * @returns {Promise<Object[]>} - List of clinics
 */

export async function fetchClinics() {
  try {
    // Construct the query parameters
    const url = BASE_URL;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching clinics: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Clinics fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    throw error;
  }
}

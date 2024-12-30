const BASE_URL =
  import.meta.env.VITE_DENTIST_BASE_URL ||
  'http://localhost:3000/api/dentist/query';
const CLINICS_BASE_URL =
  import.meta.env.VITE_CLINICS_BASE_URL ||
  'http://localhost:3000/api/clinic/query';

/**
 * Fetch dentists along with their associated clinic details.
 * @returns {Promise<Object[]>} - List of clinics with associated dentists.
 */
export async function fetchClinics() {
  try {
    // Fetch all dentists
    const responseDentists = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!responseDentists.ok) {
      throw new Error(
        `Error fetching dentists: ${responseDentists.statusText}`
      );
    }

    const dentistsData = await responseDentists.json();
    const dentists = dentistsData.data?.dentists || [];

    if (!Array.isArray(dentists)) {
      throw new Error('Invalid response format: dentists is not an array');
    }

    // Fetch clinic details by their IDs
    const clinics = await fetchAllClinics();

    // Merge clinic details with dentists
    clinics.forEach((clinic: any) => {
      clinic.dentists = dentists.filter(
        (dentist) => dentist.clinic === clinic._id
      );
    });

    console.log('Dentists: ', dentists, ' Clinics: ', clinics);
    return clinics;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    throw error;
  }
}

function extractUniqueClinicIds(dentists: any[]) {
  const clinicSet = new Set<string>();
  dentists.forEach((dentist) => {
    if (dentist.clinic) {
      clinicSet.add(dentist.clinic);
    }
  });
  return Array.from(clinicSet);
}

const fetchAllClinics = async () => {
  try {
    const response = await fetch(CLINICS_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching clinics: ${response.statusText}`);
    }

    const clinicsData = await response.json();
    return clinicsData.data?.clinics || [];
  } catch (error) {
    console.error('Error fetching clinics:', error);
    throw error;
  }
};

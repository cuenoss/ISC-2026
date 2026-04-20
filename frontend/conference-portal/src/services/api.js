const API_BASE_URL = '/api';

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Conference API functions
export const conferenceAPI = {
  // Get conference information
  getConference: () => apiRequest('/conference'),
  
  // Update conference information
  updateConference: (conferenceData) => 
    apiRequest('/admin/conference', {
      method: 'PUT',
      body: JSON.stringify(conferenceData),
    }),
  
  // Get speakers
  getSpeakers: () => apiRequest('/speakers'),
  
  // Get agenda
  getAgenda: () => apiRequest('/agenda'),
};

// Registration API functions
export const registrationAPI = {
  // Submit registration
  submitRegistration: (registrationData) => 
    apiRequest('/registration', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    }),
  
  // Check registration status
  checkRegistrationStatus: (email) => 
    apiRequest(`/certificates/status?email=${encodeURIComponent(email)}`),
};

// Papers API functions
export const papersAPI = {
  // Get all papers
  getPapers: () => apiRequest('/papers'),
  
  // Get papers by author
  getPapersByAuthor: (author) => 
    apiRequest(`/papers/author/${encodeURIComponent(author)}`),
  
  // Get papers by email
  getPapersByEmail: (email) => 
    apiRequest(`/papers/email/${encodeURIComponent(email)}`),
  
  // Submit paper
  submitPaper: (paperData) => 
    apiRequest('/submit-paper', {
      method: 'POST',
      body: JSON.stringify(paperData),
    }),
};

// Certificate API functions
export const certificateAPI = {
  // Generate certificate preview
  generatePreview: (certificateData) => 
    apiRequest('/certificate/preview', {
      method: 'POST',
      body: JSON.stringify(certificateData),
    }),
  
  // Create certificate
  createCertificate: (certificateData) => 
    apiRequest('/certificate', {
      method: 'POST',
      body: JSON.stringify(certificateData),
    }),
};


// Speakers API functions (additional endpoints)
export const speakersAPI = {
  // Get all speakers
  getAllSpeakers: () => apiRequest('/speakers'),
  
  // Get speakers by theme
  getSpeakersByTheme: (theme) => 
    apiRequest(`/speakers/theme/${encodeURIComponent(theme)}`),
  
  // Get speakers by country
  getSpeakersByCountry: (country) => 
    apiRequest(`/speakers/country/${encodeURIComponent(country)}`),
  
  // Get speaker by ID
  getSpeakerById: (id) => 
    apiRequest(`/speakers/${id}`),
};

export default {
  conferenceAPI,
  registrationAPI,
  papersAPI,
  certificateAPI,
  speakersAPI,
};

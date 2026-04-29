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
    apiRequest(`/registration/status?email=${encodeURIComponent(email)}`),
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
    apiRequest('/certificates/preview', {
      method: 'GET',
    }),
  
  // Create certificate
  createCertificate: (certificateData) => 
    apiRequest('/certificates/create', {
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

// Admin API functions
export const adminAPI = {
  // Authentication
  login: (credentials) => 
    apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  // Dashboard
  getDashboardStats: () => apiRequest('/admin/dashboard-stats'),
  
  // Conference management
  getConference: () => apiRequest('/admin/conference'),
  updateConference: (conferenceData) => 
    apiRequest('/admin/conference', {
      method: 'PUT',
      body: JSON.stringify(conferenceData),
    }),
  
  // Certificate template management
  uploadCertificateTemplate: (formData) => {
    const config = {
      method: 'POST',
      body: formData, // Don't stringify FormData
      headers: {}, // Let browser set Content-Type for FormData
    };
    return apiRequest('/admin/certificate-template', config);
  },
  getCertificateTemplate: () => apiRequest('/admin/certificate-template'),
  replaceCertificateTemplate: (formData) => {
    const config = {
      method: 'PUT',
      body: formData,
      headers: {},
    };
    return apiRequest('/admin/certificate-template', config);
  },
  
  // Speaker management
  getAllSpeakers: () => apiRequest('/admin/speakers'),
  createSpeaker: (speakerData) => 
    apiRequest('/admin/speakers', {
      method: 'POST',
      body: JSON.stringify(speakerData),
    }),
  updateSpeaker: (id, speakerData) => 
    apiRequest(`/admin/speakers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(speakerData),
    }),
  deleteSpeaker: (id) => 
    apiRequest(`/admin/speakers/${id}`, {
      method: 'DELETE',
    }),
  
  // Registration management
  getAllRegistrations: () => apiRequest('/admin/registrations'),
  updateRegistrationStatus: (id, status) => 
    apiRequest(`/admin/registrations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  markAttendance: (id, attended) => 
    apiRequest(`/admin/registrations/${id}/attendance`, {
      method: 'PUT',
      body: JSON.stringify({ attended }),
    }),
  
  // Paper management
  getAllPapers: () => apiRequest('/admin/papers'),
  updatePaperStatus: (id, status) => 
    apiRequest(`/admin/papers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  getPapersByStatus: (status) => apiRequest(`/admin/papers/status/${status}`),
};

// Feedback API functions
export const feedbackAPI = {
  submitFeedback: (feedbackData) => 
    apiRequest('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    }),
};

export default {
  conferenceAPI,
  registrationAPI,
  papersAPI,
  certificateAPI,
  speakersAPI,
  adminAPI,
  feedbackAPI,
};

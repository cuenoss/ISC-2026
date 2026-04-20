# ISC 2026 - International Scientific Conference Management System

A comprehensive web application for managing scientific conferences, featuring registration management, paper submissions, agenda scheduling, and certificate generation.

## Features

### For Conference Attendees
- **Registration System**: Online registration with status tracking
- **Paper Submission**: Submit and track research papers
- **Agenda Viewing**: Browse conference schedule and speaker information
- **Certificate Generation**: Download attendance certificates
- **Real-time Updates**: Live status updates for registrations and papers

### For Conference Administrators
- **Dashboard**: Comprehensive overview of conference statistics
- **Registration Management**: Approve/reject registrations, track attendance
- **Paper Management**: Review, accept, reject, and publish submitted papers
- **Conference Settings**: Configure conference details, themes, and settings
- **Certificate Templates**: Upload and manage certificate templates
- **Speaker Management**: Add and manage conference speakers and sessions

## Technology Stack

### Frontend
- **React 18**: Modern JavaScript library for building user interfaces
- **React Router**: Client-side routing for single-page application
- **Vite**: Fast build tool and development server
- **CSS3**: Custom styling with responsive design
- **AOS (Animate On Scroll)**: Smooth scroll animations

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework for REST APIs
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: Object modeling for MongoDB

## Project Structure

```
ISC-2026/
|
+-- backend/                 # Node.js/Express API server
|   +-- controllers/         # Route controllers
|   +-- models/             # Database models
|   +-- routes.js           # API route definitions
|   +-- db.js               # Database connection
|   +-- package.json        # Backend dependencies
|
+-- frontend/               # React frontend application
|   +-- conference-portal/  # Main React app
|       +-- public/         # Static assets
|       +-- src/            # Source code
|           +-- components/ # Reusable React components
|           +-- pages/      # Page components
|           +-- services/   # API service functions
|           +-- styles.css # Global styles
|       +-- package.json    # Frontend dependencies
|       +-- vite.config.js  # Vite configuration
|
+-- .gitignore             # Git ignore rules
+-- README.md              # This file
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/cuenoss/ISC-2026.git
   cd ISC-2026
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend/conference-portal
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/isc2026
   PORT=3000
   JWT_SECRET=your-secret-key
   ```

5. **Start the Application**
   
   **Backend Server** (in `backend` directory):
   ```bash
   npm start
   ```
   
   **Frontend Development Server** (in `frontend/conference-portal` directory):
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Admin Portal: http://localhost:5173/admin

## API Endpoints

### Conference Management
- `GET /api/conference` - Get conference details
- `PUT /api/admin/conference` - Update conference settings

### Registration
- `POST /api/register` - Submit registration
- `GET /api/admin/registrations` - Get all registrations (admin)
- `PUT /api/admin/registrations/:id` - Update registration status

### Papers
- `POST /api/submit-paper` - Submit research paper
- `GET /api/admin/papers` - Get all papers (admin)
- `PUT /api/admin/papers/:id` - Update paper status

### Certificate Templates
- `GET /api/admin/certificate-template` - Get certificate template
- `POST /api/admin/certificate-template` - Upload template
- `PUT /api/admin/certificate-template` - Update template

## Database Schema

### Conference
```javascript
{
  title: String,
  description: String,
  date: Date,
  venue: String,
  themes: String,
  email: String,
  phone: String,
  certificate_template: String // Base64 encoded image
}
```

### Registration
```javascript
{
  name: String,
  email: String,
  institution: String,
  status: String, // pending, accepted, confirmed, rejected
  attended: Boolean,
  created_at: Date
}
```

### Paper/Submission
```javascript
{
  author_name: String,
  author_email: String,
  paper_title: String,
  abstract: String,
  status: String, // pending, accepted, rejected, published
  created_at: Date
}
```

## Usage

### For Attendees
1. Visit the main page to view conference information
2. Click "Register Now" to submit your registration
3. Submit research papers through the "Submit Paper" page
4. Track your registration and paper status
5. Download attendance certificates after check-in

### For Administrators
1. Access the admin portal at `/admin`
2. Log in with admin credentials
3. Manage registrations from the dashboard
4. Review and approve/reject paper submissions
5. Configure conference settings
6. Upload certificate templates
7. Manage conference agenda and speakers

## Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Code Structure
- Components are modular and reusable
- API calls are centralized in service files
- State management uses React hooks
- Responsive design with mobile-first approach
- Clean separation between frontend and backend

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please contact:
- Email: conference@isc2026.org
- GitHub Issues: https://github.com/cuenoss/ISC-2026/issues

## Version History

- **v1.0.0** - Initial release with full conference management functionality
  - Registration system
  - Paper submission and review
  - Admin dashboard
  - Certificate generation
  - Responsive design

---

**Built with passion for scientific collaboration and knowledge sharing.**

# RESQ-LINK - Emergency Dispatch System

A modern, responsive system for Tuguegarao City's emergency dispatch system built with React, TypeScript, and Bootstrap.

## 🚀 Features

- **Role-based Authentication** - Dispatcher, Responder, and Admin roles
- **Incident Management** - Create, track, and manage emergency incidents
- **Real-time Updates** - Mock real-time incident status updates
- **Responsive Design** - Desktop-first, mobile-responsive interface
- **Interactive Dashboard** - Comprehensive incident filtering and search
- **Modern UI** - Clean, accessible design with Bootstrap 5

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router v6** for navigation
- **React Bootstrap** with Bootstrap 5
- **Context API** for state management
- **CSS3** with custom styling

## 🚀 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/GryMarker/RESQ.git
    cd RESQ
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Copy the example `.env.example` file to a new `.env` file:
    ```bash
    cp .env.example .env
    ```
    Update the `.env` file with your specific configuration, such as API keys.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be running at `http://localhost:5173`.

## 🔧 Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration (placeholder for future backend integration)
VITE_API_URL=http://127.0.0.1:8000/api/v1

# Maps Configuration (placeholder for Google Maps integration)
VITE_MAPS_KEY=your_google_maps_api_key_here
```

## 👤 Demo Authentication

The application uses mock authentication. You can log in with:

- **Email:** Any valid email format
- **Password:** Any password
- **Role:** Choose from Dispatcher, Responder, or Administrator

### Role Permissions:
- **Dispatcher:** Full access to incidents, dispatch console, map, responders, and reports
- **Responder:** Access to incidents, map, and settings
- **Administrator:** Full system access

## 🎯 Demo Script (5-minute presentation)

1. **Login as Dispatcher**
   - Use any email/password combination
   - Select "Dispatcher" role
   - Notice the clean, professional interface

2. **Incidents Management**
   - View the incidents list with real-time status badges
   - Use filters: status, type, barangay, date range
   - Click on an incident to view details (placeholder)

3. **Navigation & Layout**
   - Responsive sidebar that collapses on mobile
   - Role-aware navigation menu
   - Clean topbar with user profile and notifications

4. **Mock Data Features**
   - 12 sample incidents across Tuguegarao City barangays
   - Various incident types: fire, medical, police, rescue, traffic
   - Realistic timeline and status progression

5. **Future Integration Points**
   - Show VITE_API_URL in settings (ready for backend)
   - Explain how mock services will be replaced
   - Demonstrate responsive design on different screen sizes

## 📱 Pages & Routes

- `/login` - Authentication page
- `/incidents` - Incident list with filters
- `/incidents/:id` - Incident detail view (placeholder)
- `/dispatch` - Dispatch console (placeholder)
- `/map` - City map with markers (placeholder)
- `/responders` - Responder management (placeholder)
- `/reports` - Analytics and KPIs (placeholder)
- `/settings` - User settings and configuration (placeholder)

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AppLayout/       # Main application layout
│   ├── Topbar/          # Navigation header
│   ├── Sidebar/         # Navigation sidebar
│   ├── IncidentTable/   # Incident data table
│   ├── IncidentFilters/ # Filtering controls
│   ├── ProtectedRoute.tsx
│   └── RoleGuard.tsx
├── contexts/            # React Context providers
│   ├── AuthContext.tsx  # Authentication state
│   └── IncidentContext.tsx # Incident management
├── pages/               # Page components
│   ├── Login/
│   ├── Incidents/
│   └── NotFound.tsx
├── routes/              # Routing configuration
│   └── AppRoutes.tsx
├── styles/              # Global styles
│   └── globals.css
├── App.tsx              # Root component
└── main.tsx            # Application entry point
```

## 🔄 Mock Services

The application includes several mock services that simulate real backend functionality:

- **Authentication:** Accepts any email/password combination
- **Incident Data:** 12 pre-generated incidents with realistic data
- **Real-time Updates:** Simulated WebSocket updates (planned)
- **Geolocation:** Mock location services (planned)

## 🚀 Next Steps

### Backend Integration
1. Replace mock authentication with Laravel API
2. Connect to real incident database
3. Implement WebSocket/Pusher for real-time updates
4. Add file upload for incident attachments

### Enhanced Features
1. Google Maps integration for location services
2. Push notifications via Firebase Cloud Messaging
3. Mobile app wrapper using Capacitor
4. Advanced reporting and analytics
5. Multi-language support

### Production Deployment
1. Configure environment-specific builds
2. Set up CI/CD pipeline
3. Implement proper error handling and logging
4. Add performance monitoring

## 🛡️ Security Considerations

- Environment variables for sensitive configuration
- Role-based access control implementation
- Protected routes with authentication guards
- Input validation and sanitization (when backend is added)

## 📄 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🤝 Contributing

This is a demo MVP. For production use:

1. Replace mock services with real API calls
2. Add comprehensive error handling
3. Implement proper testing suite
4. Add accessibility improvements
5. Optimize for performance

## 📞 Support

For questions about this demo or implementation guidance, please refer to the documentation or contact the development team.

---

**RESQ-LINK** - Connecting emergency responders with those who need help most.

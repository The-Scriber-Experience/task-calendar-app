# Task & Calendar Hub

## Overview

This is a Flask-based web application that combines task management with calendar functionality. The application provides a simple, interactive interface where users can create, manage, and visualize tasks both in a sidebar list and on a calendar view. The application uses in-memory storage for simplicity and focuses on providing a clean, modern user interface with drag-and-drop functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Data Storage**: In-memory storage using Python lists and objects
- **Session Management**: Flask sessions with environment-based secret key
- **Middleware**: ProxyFix for handling reverse proxy headers

### Frontend Architecture
- **Template Engine**: Jinja2 (Flask's default)
- **CSS Framework**: Bootstrap 5.1.3 for responsive design
- **JavaScript Libraries**: 
  - jQuery 3.6.0 for DOM manipulation
  - jQuery UI 1.13.2 for drag and drop functionality
  - FullCalendar 6.1.8 for calendar visualization
- **Icons**: Font Awesome 6.0.0
- **Fonts**: Google Fonts (multiple typefaces for theming)

## Key Components

### 1. Task Management System
- **Task Model**: Simple Python class with attributes: id, title, description, due_date, completed, created_at
- **Storage**: Global list variable for in-memory task storage
- **Operations**: Create tasks via form submission, with basic validation

### 2. Web Interface
- **Base Template**: Provides common layout, Bootstrap integration, and flash message handling
- **Main Interface**: Split-screen layout with task sidebar and calendar main area
- **Task Sidebar**: Contains add task form, task filters, and task list
- **Calendar View**: FullCalendar integration for visual task representation

### 3. Styling System
- **Custom CSS**: Gradient-based design with PyScript-inspired color schemes
- **Responsive Design**: Flexbox layout that adapts to different screen sizes
- **Visual Effects**: Backdrop blur, box shadows, and gradient backgrounds

## Data Flow

1. **Task Creation**: User submits form → Flask route processes → Task object created → Stored in memory → Page redirects with flash message
2. **Task Display**: Index route renders → Template accesses global tasks list → Tasks displayed in sidebar and potentially on calendar
3. **Calendar Integration**: Frontend JavaScript loads tasks via API endpoint → FullCalendar renders events → Drag/drop interactions update display

## External Dependencies

### CDN Resources
- Bootstrap 5.1.3 (CSS/JS)
- Font Awesome 6.0.0 (Icons)
- Google Fonts (Typography)
- FullCalendar 6.1.8 (Calendar component)
- jQuery 3.6.0 and jQuery UI 1.13.2 (JavaScript functionality)

### Python Dependencies
- Flask (web framework)
- Werkzeug (WSGI utilities, specifically ProxyFix)

## Deployment Strategy

### Development Setup
- **Entry Point**: `main.py` imports and runs the Flask app
- **Configuration**: Environment variables for session secret
- **Debug Mode**: Enabled for development with host='0.0.0.0' and port=5000

### Production Considerations
- Application expects reverse proxy setup (ProxyFix middleware configured)
- Session secret should be set via environment variable
- Debug mode should be disabled in production

## Current Limitations and Future Considerations

1. **Data Persistence**: Currently uses in-memory storage, which means data is lost on restart
2. **Incomplete Features**: Some template references suggest planned features (filters, API endpoints) that aren't fully implemented
3. **Database Integration**: The `models.py` file exists but is empty, suggesting plans for database integration
4. **API Endpoints**: JavaScript references `/api/tasks` endpoint that doesn't exist in current backend

The architecture is designed to be simple and extensible, making it easy to add database persistence (likely with Drizzle ORM based on development patterns) and additional features like task filtering, due date management, and calendar synchronization.
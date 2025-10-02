🏫 Springdale Academy Digital Portal
✨ Your Gateway to Modern School Management
This repository contains the front-end application for the Springdale Academy Digital Portal, built using React and Vite. The portal aims to streamline student registration, profile viewing, and administrative tasks, ensuring data is always secure and easily accessible.

🚀 Key Features
Feature

Status

Description

New Student Registration

✅ Complete

Dynamic form for new enrollments with image (Photo/Signature) and nested parent details (up to 3 guardians).

Verification Workflow

✅ Implemented

New registrations are marked as unverified by default, pending admin review.

Student Profile View

✅ Complete

Detailed profile viewing page with quick print functionality.

Admin Dashboard

✅ Complete

Centralized view of all students with search, view, and delete capabilities.

Print Functionality

✅ Complete

Custom print CSS for beautiful, single-page profile printouts and dedicated PAN Card size ID card printing.

Responsive Header

✅ Complete

Modern, responsive header with a mobile menu drawer and conditional Admin link.

💻 Tech Stack
Framework: React v18+

Build Tool: Vite

Styling: Tailwind CSS (fully responsive)

Routing: React Router DOM

Authentication: Custom Context-based Auth (Mocked in examples)

🚦 Project Status & Issues
⚠️ Critical Known Issue
The current design of the student data structure requires manual updating of the student's class field every year (e.g., in the Edit form).

Problem: Student classes do not automatically increment at the end of the academic session (e.g., Class 6 should become Class 7).
Impact: Requires manual intervention by an administrator annually, risking data inaccuracies.

🐛 Other Known Issues
Component

Issue

Notes

ID Card Printing

Not Directly Printable

The component uses a mock function for useReactToPrint in the development environment. It only shows an alert message instead of opening the print dialog.

Student List

Verification Filter

The public /students route does not yet filter students by isVerified: true. Currently, all students are visible to logged-in users.

API Dependency

Server Required

The application is hard-coded to call server endpoints (e.g., VITE_SERVER_URL). A running backend API is mandatory for full functionality.

🛠️ Required Improvements
These improvements are critical for transitioning the portal to production readiness:

1. Automated Class Roll-Over (HIGH PRIORITY)
Implement a background mechanism (or a scheduled admin action button) that iterates through all students and automatically increments their class level by one at the start of a new academic year. This should include logic for handling the transition out of the highest grade (e.g., Class 12).

2. Admin Verification Interface
Verification Button: Add a clear "Verify Student" button to the Admin Dashboard table view.

API Integration: Create the necessary API call (PUT request) to update the student's isVerified status in the database when the button is clicked.

3. Frontend Data Management
Auth State Persistence: Ensure the Admin/User authentication state persists correctly using local storage or secure cookies.

Form Validation: Implement robust client-side validation for all fields in the Registration form (e.g., DOB format, phone number length, required file uploads).

🔧 Getting Started
Prerequisites
Node.js (v18+)

npm or yarn

A running backend server with API endpoints matching the application's fetch calls.

Installation
# Clone the repository
git clone [YOUR_REPO_URL]

# Navigate to the project directory
cd springdale-academy-portal

# Install dependencies
npm install
# IMPORTANT: Install react-to-print for production printing!
# npm install react-to-print

# Set up your environment variables
# Create a .env file in the root directory and add your server URL:
# VITE_SERVER_URL="http://localhost:3001/api"

Running the Application
# Start the development server
npm run dev

The application will be available at http://localhost:5173.
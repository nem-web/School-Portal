# 🏫 Springdale Academy Digital Portal

✨ **Your Gateway to Modern School Management**

This repository contains the **front-end application** for the **Springdale Academy Digital Portal**, built using **React + Vite**.  
The portal streamlines **student registration, profile viewing, and administrative tasks**, ensuring data is always **secure and easily accessible**.

---

## 🚀 Key Features

| Feature                      | Status         | Description                                                                                                  |
| ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| **New Student Registration** | ✅ Complete    | Dynamic form for new enrollments with image (Photo/Signature) and nested parent details (up to 3 guardians). |
| **Verification Workflow**    | ✅ Implemented | New registrations are marked as unverified by default, pending admin review.                                 |
| **Student Profile View**     | ✅ Complete    | Detailed profile viewing page with quick print functionality.                                                |
| **Admin Dashboard**          | ✅ Complete    | Centralized view of all students with search, view, and delete capabilities.                                 |
| **Print Functionality**      | ✅ Complete    | Custom print CSS for single-page profile printouts & PAN Card size ID card printing.                         |
| **Responsive Header**        | ✅ Complete    | Modern header with mobile menu drawer & conditional Admin link.                                              |

---

## 💻 Tech Stack

- **Framework**: React v18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Responsive)
- **Routing**: React Router DOM
- **Authentication**: Context-based Auth (Mocked for now)

---

## 🚦 Project Status & Issues

### ⚠️ Critical Known Issue

- **Class Auto-Roll Issue**: Student classes require **manual updates every year**.
  - Example: Class 6 → Class 7 doesn’t happen automatically.
  - **Impact**: Manual intervention risks data inaccuracy.

### 🐛 Other Known Issues

| Component            | Issue                       | Notes                                                          |
| -------------------- | --------------------------- | -------------------------------------------------------------- |
| **ID Card Printing** | Not directly printable      | Uses a mock function for `useReactToPrint` → only shows alert. |
| **Student List**     | Verification filter missing | `/students` route shows all students (verified + unverified).  |
| **API Dependency**   | Backend required            | App is hardcoded to use `VITE_SERVER_URL` backend.             |

---

## 🛠️ Required Improvements

### 1. Automated Class Roll-Over _(HIGH PRIORITY)_

- Background mechanism (or scheduled admin action button) to increment **class level by 1** at the start of each academic year.
- Handle transition out of highest grade (Class 12).

### 2. Admin Verification Interface

- Add **"Verify Student" button** in the Admin Dashboard.
- Integrate with backend API (PUT request to update `isVerified`).

### 3. Frontend Data Management

- **Auth State Persistence**: Store in **localStorage** or **secure cookies**.
- **Form Validation**: Strong validation for DOB, phone number, and required uploads.

---

## 🔧 Getting Started

### 📌 Prerequisites

- Node.js (v18+)
- npm or yarn
- Running backend server with API endpoints

### ⚙️ Installation

```bash
# Clone the repository
git clone [YOUR_REPO_URL]

# Navigate to project folder
cd springdale-academy-portal

# Install dependencies
npm install

# IMPORTANT: For production printing
npm install react-to-print
```

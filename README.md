# 🏥 MediTrack – Patient Appointment & Medical Records Portal

MediTrack is a full-stack healthcare web application that streamlines patient appointment scheduling and secure medical record management. The platform supports three user roles—**Admin**, **Doctor**, and **Patient**—with role-based access control, secure authentication, cloud file storage, and automated email notifications.

---

## 🚀 Live Demo

**Frontend:** https://meditrack-patient-appointment-recor.vercel.app

**Backend API:** https://meditrack-patient-appointment-records.onrender.com

---

## ✨ Features

### 👨‍💼 Admin
- Secure Login
- Create Doctor Accounts
- View Doctor Profiles
- Manage Patient & Doctor Information
- Welcome Email for Newly Created Doctors

### 👨‍⚕️ Doctor
- Secure Login
- View Assigned Appointments
- Approve Appointments
- Cancel Appointments
- Reschedule Appointments
- View Assigned Patient Medical Records
- Profile Management

### 🧑‍🤝‍🧑 Patient
- Register & Login
- Book Appointments
- View Appointment Status
- Cancel Pending Appointments
- Upload Medical Records (PDF/JPG/PNG)
- View Medical Records
- Delete Medical Records
- Profile Management

---

## 🔐 Authentication & Security

- JWT Authentication
- HTTP-only Cookies
- Password Hashing using bcrypt
- Role-Based Access Control (RBAC)
- Password Reset via Email
- Protected Backend Routes
- Secure File Access using AWS S3 Signed URLs

---

## 📧 Email Notifications

The application automatically sends transactional emails for:

- Patient Registration Password Reset
- Doctor Welcome Email
- Appointment Booking Confirmation
- Appointment Approval
- Appointment Cancellation
- Appointment Rescheduling

---

## ☁️ Cloud Storage

Medical records are securely stored in **AWS S3**.

Features include:

- Secure Upload
- Signed URL Generation
- File Deletion
- Support for:

  - PDF
  - JPG
  - PNG

---

## 📝 Audit Logging

Important user activities are logged including:

- Appointment Booking
- Appointment Approval
- Appointment Cancellation
- Appointment Rescheduling
- Medical Record Upload
- Medical Record Deletion

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL (Supabase)

### Authentication

- JWT
- bcrypt
- HTTP-only Cookies

### Cloud & APIs

- AWS S3
- Brevo Transactional Email API

### Deployment

- Vercel
- Render
- Supabase

---

## 📁 Project Structure

```
meditrack/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── context/
│   └── public/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── templates/
│   ├── storage/
│   ├── db/
│   └── uploads/
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend

```
PORT=

DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

BREVO_API_KEY=
EMAIL_FROM=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_BUCKET_NAME=

STORAGE_PROVIDER=S3
```

### Frontend

```
NEXT_PUBLIC_API_URL=
```

---

## 📦 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/meditrack.git
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🖼️ Screenshots

Add screenshots for:

- Login
- Register
- Admin Dashboard
- Patient Dashboard
- Doctor Dashboard
- Book Appointment
- Medical Records
- Profile
- Appointment Management

---

## 🚧 Challenges & Solutions

### 1. Email Delivery

Initially, email functionality was implemented using **Nodemailer with Gmail SMTP**. While it worked during local development, SMTP delivery experienced delays and reliability issues after deployment.

To improve production reliability, the application was migrated to the **Brevo Transactional Email API**, providing faster and more dependable email delivery.

Since Gmail sender authentication for transactional email requires custom domain verification, an Outlook email address was configured as the verified sender identity within Brevo for this project.

---

### 2. Cloud File Storage

Medical records were initially stored locally. For production deployment, storage was migrated to **AWS S3**, enabling secure cloud storage and temporary signed URLs for file access.

---

### 3. Timezone Handling

After migrating the database to Supabase PostgreSQL, appointment times were incorrectly displayed because PostgreSQL timestamps were automatically parsed as JavaScript `Date` objects by the PostgreSQL driver.

This was resolved by configuring the PostgreSQL driver to return timestamps as plain strings, preventing unintended UTC conversion and preserving the scheduled appointment time.

---

## 🔮 Future Enhancements

- Video Consultation
- Payment Gateway Integration
- SMS Notifications
- Prescription Upload
- Doctor Availability Calendar
- Search & Filter Doctors
- Analytics Dashboard
- Two-Factor Authentication (2FA)

---

## 👨‍💻 Author

**Akshay Krishnan**

GitHub: https://github.com/akshaykrishnansub
---

## 📄 License

This project was developed as part of a Full Stack Web Development Internship assignment and is intended for educational and portfolio purposes.

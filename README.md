
# ✈️ SKYBOOK
**Soar Higher, Book Smarter, Travel Freer**

A full-stack flight booking system built using the MERN stack.

![Built With](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/UI-TailwindCSS-informational?style=for-the-badge)
![Amadeus](https://img.shields.io/badge/API-Amadeus-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Default Admin Account](#default-admin-account)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🌐 Overview

SkyBook is an open-source flight booking system that provides:
- ✨ **Modular REST APIs**
- 🔐 **JWT-based Secure Auth**
- 🔁 **Amadeus API for real-time data**
- 🧑‍💼 **Admin Dashboard for flight management**
- 📱 **Responsive frontend using TailwindCSS and Vite**

---

## 🚀 Features

- 🔐 **User Authentication** (JWT + bcrypt)
- 👥 **Role-based Access** (Admin / Customer)
- 🧭 **Flight Search & Filter** (source, destination, date, class)
- 📖 **Booking System** (passenger info + mock payment)
- 🧾 **User Dashboard** (manage bookings)
- 📱 **Mobile Responsive** UI

---

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT, bcrypt

### Frontend
- React.js (with Vite)
- Tailwind CSS
- React Router
- Axios
- React Toastify

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/flight-booking
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost:3000
```

Seed sample data:
```bash
npm run seed
```

Run backend server:
```bash
npm run dev   # for development
npm start     # for production
```

Server: `http://localhost:5000`

---

### 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:3000`

---

## 🧭 Usage

1. Register or login
2. Search flights
3. Filter and sort results
4. Book a flight
5. Complete mock payment
6. View & manage bookings

---

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` – Register new user  
- `POST /api/auth/login` – Login  
- `GET /api/auth/me` – Profile  

### Flights
- `GET /api/flights` – Get all flights  
- `GET /api/flights/:id` – Get single flight  
- `POST /api/flights` – Create flight *(Admin)*  
- `PUT /api/flights/:id` – Update flight *(Admin)*  
- `DELETE /api/flights/:id` – Delete flight *(Admin)*  

### Bookings
- `POST /api/bookings` – Create booking  
- `GET /api/bookings/my-bookings` – User bookings  
- `GET /api/bookings/:id` – Booking details  
- `PUT /api/bookings/:id/cancel` – Cancel booking  
- `GET /api/bookings` – All bookings *(Admin)*  

---

## 👨‍💼 Default Admin Account

To create an admin manually:

```js
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 🗂 Project Structure

```bash
flight-booking-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

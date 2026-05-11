# InterviewX — Virtual Interview Simulator 🎯

A fully functional, free, full-stack web application for students to practice **HR**, **Technical**, and **Aptitude** interviews online. Built for college placement preparation.

![Tech Stack](https://img.shields.io/badge/React-18-blue?logo=react) ![Tech Stack](https://img.shields.io/badge/Node.js-Express-green?logo=node.js) ![Tech Stack](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb) ![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- **3 Interview Types**: HR (open-ended), Technical (MCQ), Aptitude (MCQ)
- **3 Difficulty Levels**: Easy, Medium, Hard
- **60-Second Timer**: Per question with auto-advance
- **Keyword-Based Scoring**: No AI required — uses keyword matching for HR and exact match for MCQ
- **Detailed Results**: Score, feedback tier, question-by-question review
- **Dashboard**: Stats cards, performance chart (Chart.js), attempt history
- **Dark Mode**: Toggle with localStorage persistence
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Company Questions**: Tagged with Google, Amazon, TCS, Infosys, Wipro
- **60+ Questions**: Pre-loaded seed data across all categories

---

## 📁 Project Structure

```
kannan/
├── client/                  # React frontend (Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # Auth & Theme contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service (Axios)
│   │   ├── App.jsx          # Root component with routing
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Tailwind + global styles
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                  # Node.js + Express backend
│   ├── config/db.js         # MongoDB connection
│   ├── middleware/auth.js   # JWT middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API route handlers
│   ├── seed/seedData.js     # Database seed script
│   ├── server.js            # Entry point
│   ├── .env.example         # Environment variable template
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+ and npm — [Download](https://nodejs.org/)
- **MongoDB Atlas** account (free tier) — [Sign up](https://www.mongodb.com/cloud/atlas)

### 1. Clone the Project

```bash
cd kannan
```

### 2. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new **Free Shared Cluster** (M0 tier)
3. Under **Database Access**, create a database user with a username and password
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` for development)
5. Click **Connect** → **Connect your application** → Copy the connection string

### 3. Configure Environment Variables

```bash
cd server
copy .env.example .env
```

Edit `server/.env` and replace the placeholder values:

```env
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/interviewx?retryWrites=true&w=majority
JWT_SECRET=any_random_secret_string_here
PORT=5000
```

### 4. Install Dependencies & Seed Database

```bash
# Install server dependencies
cd server
npm install

# Seed the database with 60+ questions
npm run seed

# Install client dependencies
cd ../client
npm install
```

### 5. Run the Application

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
You should see:
```
✅ MongoDB Connected: ...
🚀 InterviewX server running on port 5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
You should see:
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:3000
```

### 6. Open the App

Visit **http://localhost:3000** in your browser.

---

## 🎮 How to Use

1. **Register** a new account or **Login**
2. Go to **Start Interview** and select:
   - Interview type (HR / Technical / Aptitude)
   - Difficulty (Easy / Medium / Hard)
   - Company filter (optional)
3. Answer questions within the **60-second timer**
4. View your **score and detailed results**
5. Check the **Dashboard** for performance analytics

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v3     |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB Atlas (free tier)           |
| Auth       | JWT + bcryptjs                      |
| Charts     | Chart.js + react-chartjs-2          |
| HTTP       | Axios                               |

---

## 📡 API Endpoints

| Method | Endpoint                   | Auth | Description                    |
|--------|----------------------------|------|--------------------------------|
| POST   | `/api/auth/register`       | No   | Register a new user            |
| POST   | `/api/auth/login`          | No   | Login and get JWT              |
| GET    | `/api/auth/me`             | Yes  | Get current user profile       |
| GET    | `/api/questions`           | Yes  | Fetch randomized questions     |
| GET    | `/api/questions/companies` | Yes  | List available companies       |
| POST   | `/api/attempts`            | Yes  | Submit interview attempt       |
| GET    | `/api/attempts`            | Yes  | Get user's attempt history     |
| GET    | `/api/attempts/:id`        | Yes  | Get single attempt details     |

---

## 🚢 Deployment

### Frontend → Vercel (Free)
1. Push `client/` to a GitHub repo
2. Import in [Vercel](https://vercel.com)
3. Set Root Directory to `client`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`

### Backend → Render (Free)
1. Push `server/` to a GitHub repo
2. Create a new **Web Service** on [Render](https://render.com)
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`

### Database → MongoDB Atlas
Already configured in step 2 above (free M0 tier).

---

## 📄 License

This project is open source and free to use for educational purposes.

Built with ❤️ for students preparing for placements. 🎓

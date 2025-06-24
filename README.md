# Wellnest - Complete Healthcare Platform

A full-stack medicine ordering platform with AI chatbot, voice assistant, and senior-friendly features.

## 🚀 Features

### Core Features
- **Medicine Ordering**: Browse 100+ medicines with detailed information
- **Prescription Upload**: Upload and verify prescriptions with pharmacist review
- **Voice Assistant**: Voice commands for ordering and navigation
- **AI Chatbot**: Medical Q&A with smart responses
- **Senior Mode**: Large fonts, high contrast, accessibility features
- **Cart & Checkout**: Complete shopping experience with multiple payment options
- **Medicine Reminders**: Automated reminders for medication schedules

### Advanced Features
- **Real-time Search**: Debounced search with auto-suggestions
- **User Authentication**: Phone OTP and email login
- **Order Tracking**: Complete order management system
- **Lab Test Booking**: Home sample collection booking
- **Doctor Consultation**: Online doctor appointment booking
- **Responsive Design**: Mobile-first, works on all devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Context API** for state management
- **Web Speech API** for voice features

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **Multer** for file uploads
- **Nodemailer** for emails
- **Twilio** for SMS

### DevOps
- **Docker** containerization
- **Docker Compose** for local development
- **Nginx** reverse proxy
- **Environment-based configuration**

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Docker (optional)

### Local Development

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/yourusername/wellnest.git
cd wellnest
\`\`\`

2. **Backend Setup**
\`\`\`bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
\`\`\`

3. **Frontend Setup**
\`\`\`bash
cd client
npm install
npm start
\`\`\`

4. **Database Setup**
\`\`\`bash
cd server
npm run seed
\`\`\`

### Docker Development

\`\`\`bash
docker-compose up --build
\`\`\`

Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## 🔧 Configuration

### Environment Variables

**Server (.env)**
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wellnest
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com

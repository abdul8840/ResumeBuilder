# 🚀 ResumeAI — AI-Powered Resume Builder

<div align="center">

![ResumeAI Banner](https://img.shields.io/badge/ResumeAI-AI%20Powered%20Resume%20Builder-6366f1?style=for-the-badge&logo=react&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat-square&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br />

**Build stunning, ATS-optimized resumes in minutes with the power of AI.**  
Live preview · Voice input · Drag & drop · PDF export · Analytics dashboard

<br />

[🌐 Live Demo](#) · [📖 Documentation](#-table-of-contents) · [🐛 Report Bug](issues) · [✨ Request Feature](issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#-api-reference)
- [AI Features Deep-Dive](#-ai-features-deep-dive)
- [Resume Templates](#-resume-templates)
- [Redux State Management](#-redux-state-management)
- [Database Schema](#-database-schema)
- [Image Processing Pipeline](#-image-processing-pipeline)
- [PDF Export](#-pdf-export)
- [Analytics System](#-analytics-system)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**ResumeAI** is a full-stack, production-ready resume builder web application that combines
a beautiful, modern UI with the intelligence of Google Gemini AI. Users can create
professional, ATS-optimized resumes in minutes — with real-time live preview,
drag-and-drop section reordering, voice-to-text input, multi-template support,
and a comprehensive analytics dashboard.

### Why ResumeAI?

| Problem | Our Solution |
|---------|-------------|
| Writing a strong summary is hard | AI generates it in seconds |
| Not knowing if resume passes ATS | Real-time ATS scoring & fixes |
| Generic resumes for every job | Job-description-based customization |
| Time-consuming manual formatting | 7 beautiful templates, instant preview |
| Slow typing during creation | Voice-to-text dictation |
| No insight on resume performance | Full analytics dashboard |
| Profile photos with messy backgrounds | AI background removal |

---

## ✨ Features

### 🤖 AI-Powered Features (Google Gemini)
- **Professional Summary Generator** — Creates compelling, ATS-optimized summaries tailored to your role
- **Experience Enhancer** — Transforms vague descriptions into powerful bullet points with metrics
- **Skills Suggester** — Recommends in-demand skills based on your target job role
- **ATS Compatibility Checker** — Scores your resume 0–100 with actionable improvement tips
- **Job Description Matcher** — Analyzes a job posting and suggests targeted customizations
- **Keyword Optimizer** — Identifies missing keywords and suggests power action verbs
- **Project Description Generator** — Creates impressive project descriptions from bullet points
- **Improvement Tips Engine** — Personalized, prioritized recommendations to boost your score

### 📄 Resume Builder
- **Live Real-time Preview** — See changes instantly as you type
- **Drag & Drop Section Reorder** — Intuitively reorganize resume sections using @dnd-kit
- **Voice-to-Text Input** — Dictate resume content hands-free (Web Speech API)
- **Auto-save** — Resumes auto-save every 2 minutes
- **Version History** — Track resume version numbers
- **Completion Percentage** — Visual indicator of resume completeness
- **Section Collapse/Expand** — Clean, organized editing experience

### 🎨 Templates & Customization
- **7 Premium Templates**: Modern, Classic, Minimal, Creative, Executive, Tech, Elegant
- **Color Scheme Customizer** — Pick from 8 presets or define custom colors
- **Font Selection** — Multiple professional font families
- **Font Size Control** — Small, Medium, Large
- **Per-template Color Inheritance** — Templates respect your chosen color scheme

### 📊 Analytics & Insights
- **Dashboard Overview** — Stats cards for resumes, views, downloads, ATS score
- **Activity Charts** — Area charts showing views, downloads, edits over time
- **Template Distribution** — Pie chart of templates used
- **Event Breakdown** — Bar chart of all activity types
- **Performance Radar** — Multi-dimensional performance visualization
- **Top Resumes Table** — Ranked by views with ATS scores and status
- **AI Usage Tracking** — Track summaries generated, ATS checks, enhancements
- **Configurable Time Periods** — 7, 30, or 90 day windows

### 🔐 Authentication & Security
- **JWT Access Tokens** (7 day expiry) + **Refresh Tokens** (30 day expiry)
- **Automatic Token Refresh** — Seamless re-authentication using refresh token
- **Password Reset via Email** — Secure tokenized reset flow (10 min expiry)
- **Bcrypt Password Hashing** — 12 salt rounds
- **MongoDB Sanitization** — Prevent NoSQL injection
- **Helmet.js** — Secure HTTP headers
- **Rate Limiting** — 100 req/15min globally, 10 req/15min for auth, 20 req/min for AI
- **CORS Configuration** — Whitelist-based origin control

### 🖼️ Image Processing
- **AI Background Removal** — Powered by remove.bg API
- **Sharp Optimization** — Resize, compress and convert images
- **Dual Cloud Storage** — Cloudinary (primary CDN) + ImageKit (optimization)
- **Graceful Fallback** — Falls back to original if background removal fails
- **Thumbnail Generation** — Auto-creates 120×120 thumbnails
- **Drag-and-drop Upload** — Via react-dropzone with preview

### 📄 Resume Management
- **Unlimited Sections**: Personal Info, Summary, Experience, Education, Skills,
  Projects, Certifications, Languages, Awards, Volunteer Work, Custom Sections
- **Duplicate Resume** — One-click cloning
- **Archive/Unarchive** — Soft archive for old resumes
- **Public Resume Links** — Share a read-only public URL
- **PDF Export** — High-quality multi-page PDF via jsPDF + html2canvas
- **Download Tracking** — Analytics event fires on every PDF export
- **Search & Filter** — Search by title, filter by template, sort by multiple criteria
- **Grid & List View** — Toggle between card grid and compact list

### 👤 Profile Management
- **Profile Image Upload** with AI background removal
- **Account Preferences** — Default template, language, theme
- **Notification Settings** — Granular email notification controls
- **Password Change** — Secure in-app password update
- **Subscription Plan Display** — Free / Pro / Enterprise badges
- **Usage Stats** — Resumes created, downloads, profile views

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | Runtime |
| **Express.js** | 4.x | Web framework |
| **MongoDB** | 8.x | Primary database |
| **Mongoose** | 8.x | ODM + schema validation |
| **JWT** | 9.x | Authentication tokens |
| **Bcryptjs** | 2.x | Password hashing |
| **Google Gemini AI** | 0.21+ | AI content generation |
| **Cloudinary** | 2.x | Image CDN & storage |
| **ImageKit** | 5.x | Image optimization CDN |
| **Sharp** | 0.33+ | Server-side image processing |
| **Axios** | 1.x | HTTP client (remove.bg API) |
| **Nodemailer** | 6.x | Transactional email |
| **Multer** | 1.x | Multipart file upload |
| **Helmet** | 8.x | HTTP security headers |
| **Express Rate Limit** | 7.x | API rate limiting |
| **Express Validator** | 7.x | Input validation |
| **Morgan** | 1.x | HTTP request logging |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19 | UI framework |
| **Redux Toolkit** | 2.x | State management |
| **Redux Persist** | 6.x | State persistence |
| **React Router DOM** | 7.x | Client-side routing |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **Framer Motion** | 11.x | Animations & transitions |
| **@dnd-kit** | 6.x/8.x | Drag and drop |
| **Recharts** | 2.x | Data visualization |
| **jsPDF** | 2.x | PDF generation |
| **html2canvas** | 1.x | DOM to canvas rendering |
| **React Hot Toast** | 2.x | Toast notifications |
| **React Dropzone** | 14.x | File upload with drag & drop |
| **React Speech Recognition** | 3.x | Voice-to-text input |
| **Headless UI** | 2.x | Accessible UI primitives |
| **Lucide React** | 0.474+ | Icon system |
| **Axios** | 1.x | HTTP client |
| **UUID** | 11.x | Unique ID generation |

---

## 📁 Project Structure

resume-builder/
│
├── 📂 backend/
│ ├── 📄 server.js # Entry point — creates HTTP server
│ ├── 📄 package.json # Dependencies & scripts
│ ├── 📄 .env # Environment variables (gitignored)
│ ├── 📄 .env.example # Environment variable template
│ │
│ └── 📂 src/
│ ├── 📄 app.js # Express app — middleware & routes
│ │
│ ├── 📂 config/
│ │ ├── 📄 db.js # MongoDB connection
│ │ ├── 📄 cloudinary.js # Cloudinary SDK setup + helpers
│ │ └── 📄 imagekit.js # ImageKit SDK setup + helpers
│ │
│ ├── 📂 models/
│ │ ├── 📄 User.js # User schema (auth, profile, stats)
│ │ ├── 📄 Resume.js # Resume schema (all sections + ATS)
│ │ └── 📄 Analytics.js # Analytics events schema
│ │
│ ├── 📂 controllers/
│ │ ├── 📄 authController.js # Register, login, logout, reset password
│ │ ├── 📄 resumeController.js # CRUD, duplicate, archive, public view
│ │ ├── 📄 aiController.js # All 8 Gemini AI endpoints
│ │ ├── 📄 imageController.js # Upload, BG removal, asset upload
│ │ └── 📄 analyticsController.js # Dashboard stats, resume analytics
│ │
│ ├── 📂 middleware/
│ │ ├── 📄 auth.js # JWT protect, authorize, optional auth
│ │ ├── 📄 errorHandler.js # Global error handler
│ │ ├── 📄 rateLimiter.js # API, auth, AI rate limiters
│ │ └── 📄 upload.js # Multer memory storage config
│ │
│ ├── 📂 routes/
│ │ ├── 📄 authRoutes.js # /api/auth/*
│ │ ├── 📄 resumeRoutes.js # /api/resumes/*
│ │ ├── 📄 aiRoutes.js # /api/ai/*
│ │ ├── 📄 imageRoutes.js # /api/images/*
│ │ └── 📄 analyticsRoutes.js # /api/analytics/*
│ │
│ └── 📂 utils/
│ ├── 📄 generateToken.js # JWT access + refresh token generators
│ ├── 📄 emailService.js # Welcome & password reset emails
│ └── 📄 helpers.js # sanitizeUser, paginate, extractText…
│
└── 📂 frontend/
├── 📄 index.html # Vite HTML entry
├── 📄 vite.config.js # Vite + Tailwind config
├── 📄 package.json
├── 📄 .env # Frontend env vars
│
└── 📂 src/
├── 📄 main.jsx # ReactDOM root + Redux Provider
├── 📄 App.jsx # Route definitions
├── 📄 index.css # Tailwind + custom CSS tokens
│
├── 📂 app/
│ └── 📄 store.js # Redux store + persist config
│
├── 📂 features/ # Redux Toolkit slices
│ ├── 📂 auth/
│ │ └── 📄 authSlice.js # Auth state + 9 async thunks
│ ├── 📂 resume/
│ │ └── 📄 resumeSlice.js # Resume state + 30+ actions
│ ├── 📂 ai/
│ │ └── 📄 aiSlice.js # AI state + 8 async thunks
│ └── 📂 analytics/
│ └── 📄 analyticsSlice.js # Analytics state + thunks
│
├── 📂 services/ # Axios API layer
│ ├── 📄 api.js # Axios instance + interceptors
│ ├── 📄 authService.js
│ ├── 📄 resumeService.js
│ ├── 📄 aiService.js
│ ├── 📄 imageService.js
│ └── 📄 analyticsService.js
│
├── 📂 hooks/ # Custom React hooks
│ ├── 📄 useAuth.js
│ ├── 📄 useResume.js
│ ├── 📄 useAI.js
│ └── 📄 useToast.js
│
├── 📂 utils/
│ ├── 📄 constants.js # Templates, colors, skill levels…
│ ├── 📄 helpers.js # formatDate, createEmpty*, classNames…
│ ├── 📄 validators.js # Form validation rules
│ └── 📄 pdfExport.js # jsPDF + html2canvas export logic
│
├── 📂 components/
│ ├── 📂 auth/
│ │ ├── 📄 ProtectedRoute.jsx
│ │ └── 📄 GuestRoute.jsx
│ │
│ ├── 📂 common/ # Reusable UI components
│ │ ├── 📄 Button.jsx # 8 variants, sizes, loading state
│ │ ├── 📄 Input.jsx # Labels, icons, error, password toggle
│ │ ├── 📄 Modal.jsx # Headless UI dialog with animation
│ │ ├── 📄 Loader.jsx # Spinner, dots, fullscreen variants
│ │ ├── 📄 Toast.jsx # react-hot-toast wrapper
│ │ ├── 📄 Badge.jsx # 9 color variants + dot indicator
│ │ ├── 📄 Card.jsx # Glass, hover, gradient variants
│ │ ├── 📄 Avatar.jsx # Image + initials fallback + status
│ │ ├── 📄 Tooltip.jsx # 4 position animated tooltip
│ │ ├── 📄 ProgressBar.jsx # Animated, dynamic color
│ │ ├── 📄 EmptyState.jsx # Emoji/icon + CTA
│ │ └── 📄 ConfirmDialog.jsx # Accessible confirm modal
│ │
│ ├── 📂 layout/
│ │ ├── 📄 Navbar.jsx # Top bar + notifications + profile
│ │ ├── 📄 Sidebar.jsx # Animated sidebar + usage tracker
│ │ ├── 📄 DashboardLayout.jsx # Layout wrapper with Outlet
│ │ └── 📄 AuthLayout.jsx # Split-panel auth layout
│ │
│ └── 📂 resume/
│ ├── 📄 ResumeBuilder.jsx # DnD builder + auto-save
│ ├── 📄 ResumePreview.jsx # Live preview router
│ ├── 📄 AIToolsPanel.jsx # ATS, Job Match, Keywords, Tips
│ │
│ ├── 📂 templates/
│ │ ├── 📄 ModernTemplate.jsx
│ │ ├── 📄 ClassicTemplate.jsx
│ │ └── 📄 MinimalTemplate.jsx
│ │
│ └── 📂 sections/
│ ├── 📄 PersonalInfoSection.jsx
│ ├── 📄 SummarySection.jsx # Voice + AI generation
│ ├── 📄 ExperienceSection.jsx # AI enhance + achievements
│ ├── 📄 EducationSection.jsx
│ ├── 📄 SkillsSection.jsx # AI suggest + categories
│ ├── 📄 ProjectsSection.jsx # AI description generation
│ ├── 📄 CertificationsSection.jsx
│ └── 📄 LanguagesSection.jsx
│
└── 📂 pages/
├── 📄 LandingPage.jsx # Marketing landing page
├── 📄 NotFoundPage.jsx # 404
├── 📂 auth/
│ ├── 📄 LoginPage.jsx
│ ├── 📄 RegisterPage.jsx
│ ├── 📄 ForgotPasswordPage.jsx
│ └── 📄 ResetPasswordPage.jsx
├── 📂 dashboard/
│ └── 📄 DashboardPage.jsx # Charts + stats + quick actions
├── 📂 resume/
│ ├── 📄 ResumesPage.jsx # Grid/List + CRUD + filters
│ ├── 📄 ResumeBuilderPage.jsx # Full-screen builder + preview
│ └── 📄 ResumePreviewPage.jsx # Read-only preview + export
├── 📂 profile/
│ └── 📄 ProfilePage.jsx # Photo upload + settings tabs
└── 📂 analytics/
└── 📄 AnalyticsPage.jsx # Full analytics with charts

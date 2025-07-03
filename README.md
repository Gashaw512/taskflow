# 🚀 TaskFlow – Self-Hosted Task Management for Teams and Individuals

**TaskFlow** is a powerful, privacy-focused, and self-hosted task management system built for professionals, teams, and individuals who value structure, control, and productivity.

Designed with a clean architecture and smart workflows, TaskFlow helps you organize your personal tasks, team projects, recurring routines, and notes — all in one place, while keeping your data under your control.

---

## ✨ Why TaskFlow?

- 📚 **Hierarchical Organization** – Structure your tasks under projects, and projects under areas.
- 🔁 **Smart Recurring Tasks** – Flexible repetition logic with completion-based scheduling and parent-child tracking.
- 📝 **Notes & Tags** – Capture ideas and attach them to projects or tasks with full tagging support.
- 🤖 **Telegram Integration** – Create and receive tasks via Telegram for instant access.
- 🛡️ **Full Data Ownership** – Host it yourself. No vendor lock-in. No trackers. Just your data, your way.

---

## 🧠 Key Features

### ✅ Task & Project Management
- Create, update, and complete tasks
- Organize tasks into projects, and group projects into areas
- Filter tasks by Today, Upcoming, Someday, and more
- Sort by Name, Due Date, Created At, or Priority

### 🔁 Recurring Task Engine
- Supports daily, weekly, monthly, and advanced recurrence patterns (e.g., "2nd Friday every month")
- Choose between **due-date-based** or **completion-based** recurrence
- Edit recurrence directly from any child instance
- Track parent-child relationships in recurring series

### 📎 Notes & Tags
- Attach quick notes to tasks or projects
- Create and assign tags for advanced categorization

### 📅 Scheduling & Deadlines
- Assign due dates and monitor by date filters
- View and manage time-sensitive tasks with ease

### 📱 Telegram Bot Integration
- Add tasks on the go from Telegram
- Receive daily task summaries in your chat
- Instantly capture thoughts with a message

### 🌐 Multi-language Support
- English, German, Spanish, Greek, Japanese, Ukrainian, and more

### 💡 Developer Friendly
- Built with Node.js, Express, React, and SQLite
- Clean RESTful API
- Easy-to-extend architecture
- Docker-ready for rapid deployment

---

## 🛠️ Installation & Setup

### 🚀 Quick Start with Docker

```bash
docker pull taskflow/taskflow:latest

docker run \
  -e TFL_USER_EMAIL=admin@example.com \
  -e TFL_USER_PASSWORD=yourstrongpassword \
  -e TFL_SESSION_SECRET=$(openssl rand -hex 64) \
  -e TFL_INTERNAL_SSL_ENABLED=false \
  -e TFL_ALLOWED_ORIGINS=https://taskflow.example.com,http://localhost:3002 \
  -v ~/taskflow_data:/app/backend/db \
  -p 3002:3002 \
  -d taskflow/taskflow:latest

  ## 🚀 Getting Started

Once TaskFlow is running in Docker, visit:  
👉 **[http://localhost:3002](http://localhost:3002)** to get started.

---

## ⚙️ Environment Variables

### Required

| Variable             | Description                                           |
|----------------------|-------------------------------------------------------|
| `TFL_USER_EMAIL`      | Initial admin user email                              |
| `TFL_USER_PASSWORD`   | Initial admin password                                |
| `TFL_SESSION_SECRET`  | Session encryption key (`openssl rand -hex 64`)       |

### Optional

| Variable                  | Description                                                    |
|---------------------------|----------------------------------------------------------------|
| `TFL_INTERNAL_SSL_ENABLED`| Enable HTTPS internally (default: `false`)                     |
| `TFL_ALLOWED_ORIGINS`     | CORS whitelist (e.g., `https://taskflow.com,http://localhost:3002`) |

---

## 🧪 Development Setup

### Prerequisites

- Node.js 20+
- npm
- SQLite3
- Docker (optional)
- OpenSSL (for generating secrets)
- Git

---

### 🔧 Local Installation

```bash
git clone https://github.com/Gashaw512/taskflow.git
cd taskflow

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

## 🚀 Start the Application (Development)

### ▶️ Start the Backend (Express API)

```bash
cd backend
npm run dev

cd ..
npm run dev

Once both servers are running, open your browser and navigate to:
👉 http://localhost:8080

🗃️ Database Management
The database is automatically initialized on the first run.
For manual control and development operations:

cd backend

# Drop and recreate all tables (Destructive)
npm run db:init

# Sync models without deleting existing data
npm run db:sync

# Apply defined migrations
npm run db:migrate

# Full reset: drops all tables and recreates
npm run db:reset

📦 Migrations
To manage schema changes using Sequelize migrations:

# Create a new migration file
npm run migration:create add-status-to-projects

# Apply all pending migrations
npm run migration:run

# Create a new migration file
npm run migration:create add-status-to-projects

# Apply all pending migrations
npm run migration:run

You can also check status or undo migrations:

# Check migration status
npm run migration:status

# Undo last migration
npm run migration:undo

# Undo all migrations
npm run migration:undo:all

🔒 Authentication
TaskFlow uses secure, session-based authentication with HTTP-only cookies.

🧪 Default Development Credentials
If no admin credentials are set via environment variables, the following will be used:

Email: dev@example.com

Password: password123


👤 Manually Create a New User
To create a user manually in development:

cd backend
npm run user:create user@example.com securepassword

cd backend
npm run user:create user@example.com securepassword



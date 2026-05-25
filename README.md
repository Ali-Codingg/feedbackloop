# FeedbackLoop

FeedbackLoop is a full-stack feedback management platform that allows users to submit feature requests, vote on published ideas, and follow status updates. Admins can review submitted requests, publish them, update their status, delete requests, and add progress updates.

This project was built as a semester project using React, Express, PostgreSQL, Prisma, and JWT authentication.

---

## Features

### User Features
- Register and login
- Submit feature requests
- View published feature requests
- Search and filter public requests
- View request details
- Vote and remove vote
- View status update history

### Admin Features
- Login as admin
- View all requests, including pending and unpublished requests
- Publish or unpublish requests
- Change request status
- Delete requests
- Add status updates / changelog messages

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- CSS

### Backend
- Node.js
- Express.js
- JWT authentication
- bcrypt password hashing

### Database
- PostgreSQL
- Prisma ORM

### Version Control
- Git
- GitHub

---

## Project Structure

```text
feedbackloop/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── prisma/
│   └── package.json
│
└── README.md
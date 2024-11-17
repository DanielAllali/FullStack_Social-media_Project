# Social Media Application

A full-stack social media platform built with MongoDB, Node.js, and React.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## About the Project

This project is a fully functional social media application where users can sign up, create profiles, connect with others, and share posts. It emphasizes scalability, performance, and a seamless user experience.

---

## Features

- **User Authentication**: Register, login, and secure JWT-based authentication.
- **User Profiles**: Customizable user profiles with bio, profile picture, and other details.
- **Post Creation**: Create, edit, and delete posts with text, or images.
- **Like and Comments**: Engage with posts through likes and comments.
- **Real-Time Notifications**: Notifications for likes, comments, and new connections.
- **Search and Explore**: Search users and explore trending content.
- **Responsive Design**: Fully responsive UI for all screen sizes.

---

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **Axios**: For handling API requests.

### Backend
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web application framework for Node.js.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
# [API Documentation](https://documenter.getpostman.com/view/36795440/2sAY52bJjm)

### Other Technologies
- **JWT**: Secure authentication and authorization.
- **dotenv**: For managing environment variables.
- **bcrypt**: For storing sensetive data.
- - **nodemailer**: To send verification codes.
---

## Installation

### Prerequisites
1. Node.js (v16 or higher)
2. MongoDB (local or cloud instance)
3. npm or yarn

### Steps

1. Clone the repository:
   git clone https://github.com/your-username/social-media-app.git
   cd social-media-app

2. Install dependencies for the backend:
  cd backend
  npm install
3. Set up environment variables in a .env file:
  NODE_ENV="development"
  PORT
  URL
  MONGO_URI
  MONGO_ATLAS_URI
  GOOGLE_APP_PASSWORD
  APP_EMAIL
  JWT_SECRET
4.Start the backend server:
  npm start
5.Install dependencies for the frontend:
  cd ../frontend
  npm install
6.Start the React development server:
  npm install

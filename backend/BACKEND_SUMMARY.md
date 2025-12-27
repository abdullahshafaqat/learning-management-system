# Learning Management System - Backend Documentation

## Project Overview

This document summarizes the current state of the backend implementation for the Learning Management System (LMS). The backend is built using **Node.js** and **Express**, with **MongoDB** as the database.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer

## Implemented Features

### 1. Authentication & Authorization

- **Routes**: `/auth`
- **Endpoints**:
  - `POST /Signup`: Register a new user (Student/Teacher).
  - `POST /Login`: Authenticate user and receive a token.
  - `POST /Logout`: Log out the user.
- **Middleware**:
  - `authMiddleware`: Verifies JWT tokens to protect routes.
  - `roleMiddleware`: Enforces role-based access control (e.g., Teacher, Student, Admin).

### 2. Course Management

- **Routes**: `/api/courses` (Prefix assumed based on typical app structure, actual route file is `courseRoutes.js`)
- **Endpoints**:
  - `POST /courses`: Create a new course.
    - **Access**: Teacher, Admin.
  - `GET /courses/teacher`: Retrieve courses created by the authenticated teacher.
    - **Access**: Teacher, Admin.

### 3. Lecture Management

- **Routes**: `/api/lectures` (handled in `lectureRoutes.js`)
- **Endpoints**:
  - `POST /courses/:courseId`: Add a lecture to a specific course.
    - **Access**: Teacher, Admin.
    - **Features**: Supports file uploads (e.g., video/materials).
  - `GET /courses/:courseId`: Get all lectures for a specific course.
    - **Access**: Authenticated Users.

### 4. Enrollment System

- **Routes**: `/api/enrollment` (handled in `enrollmentRoutes.js`)
- **Endpoints**:
  - `POST /courses/:courseId/enroll`: Enroll a student in a course.
    - **Access**: Student only.
  - `GET /student/enrollments`: View all courses the current student is enrolled in.
    - **Access**: Student only.

### 5. File Handling

- **Middleware**: `upload.js`
- **Functionality**: Handles multipart/form-data for uploading lecture materials and other files.

## Directory Structure

- `src/controllers`: Logic for handling requests.
- `src/models`: Mongoose schemas (User, Course, Lecture, Enrollment).
- `src/routes`: API route definitions.
- `src/middlewares`: Custom middleware (Auth, Role, Upload).
- `src/services`: Business logic layer (e.g., `authService.js`).
- `src/utils`: Utility functions.

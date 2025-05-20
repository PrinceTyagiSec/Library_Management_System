# Library Management System

An all-in-one Library Management System created as a capstone project for a Bachelor of Computer Applications (BCA) degree. This system allows effective management of books and their borrowing history as well as the differentiation of users into various levels through user and administrator interfaces.

---

## Description of the Project

- **Title of the Project:** Library Management System

- **Name of the Student:** Prince Tyagi

- **Course of Study:** Bachelor of Computer Applications (BCA)

- **Current Semester:** 6th

- **Year of Study:** 2024–2025

- **University Attended:** Amity University Online

- **Name of the Guide:** Duvalier Miafo

---

## Functionalities

- Enhanced security features for user and administrator login and authentication

- Smooth navigation of available books and book borrowing capabilities

- Administrative dashboard for Book and User management

- Viewing history of borrowed books and returning books

- Backend developed with Flask and has RESTful APIs
  
- Frontend developed with React and Tailwind CSS and is responsive

--- 

## Stack of Technologies

| Layer          | Technology                  |
|----------------|-----------------------------|
| Frontend       | React, Tailwind CSS         |
| Backend        | Flask (Python)              |
| Database       | MySQL                       |
| Authentication | JWT (JSON Web Tokens)       |

--- 

## Required Technologies

- Node.js (Version 14 or newer)

- npm (Node Package Manager)

- Python (Versions 3.7 or newer)

- pip (Python Package Installer)

- MySQL database with proper installation and configuration

--- 

## Steps to Install and Configure Software 

### Frontend

```bash

cd library-frontend

npm install

npm run dev

```

### Backend
  
```python
 
cd library-backend
 
pip install -r requirements.txt
 
flask run
 
```

## Environment Configuration (library-backend/.env)

The `library-backend` folder includes a `.env` file required to configure sensitive settings like email functionality. For security reasons, email credentials are left blank and must be filled in manually.

### How to Edit `.env`:
1. Open the `.env` file located in `library-backend`.

2. Add your email credentials:

```bash
MAIL_USERNAME=your_email@example.com
MAIL_PASSWORD=your_email_app_password
```

**Important Notes:**

- Do not use your personal email password.

- If you're using Gmail:

  - Enable 2-Step Verification: https://myaccount.google.com/security

  - Generate an App Password: https://support.google.com/accounts/answer/185833

3. Save the file and restart the backend (`flask run`).

### Example `.env` File After Configuration

```bash
MAIL_USERNAME=libraryadmin@example.com
MAIL_PASSWORD=abcdefg12345678
```


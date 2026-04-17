# UniLink – Smart Campus Communication Platform

## Overview  
UniLink is a centralized web-based platform designed to streamline communication within academic institutions. It brings together important updates such as assignments, events, internships, and announcements into a single, unified system.

---

## Live Website  

Visit the deployed application:  
https://unilnk.onrender.com/

Users can access the platform using their college email ID.

---

## Problem Statement  
Academic institutions generate a large amount of daily information, including:
- Assignment deadlines  
- Event notifications  
- Internship opportunities  
- Scholarship alerts  
- Administrative announcements  

This information is often distributed across multiple platforms such as WhatsApp groups, emails, and notice boards. As a result:
- Students may miss important updates  
- Faculty face difficulty reaching the intended audience  

---

## Proposed Solution  
UniLink provides a centralized platform where:
- Faculty can post announcements efficiently  
- Students can access all updates in one place  
- Information is structured and categorized  

---

## Tech Stack  

Frontend:  
- HTML  
- CSS  
- JavaScript  

Backend:  
- Node.js  
- Express.js  

Database:  
- MongoDB  

Authentication:  
- Google OAuth (restricted to college email IDs)  

Deployment:  
- Render  

---

## Features  

- Secure login using college email  
- Centralized announcements dashboard  
- Categorized posts (assignments, events, internships, etc.)  
- Notification system  
- Role-based access (Admin, Faculty, Student)  
- Responsive user interface  

---

## System Architecture  

- Frontend communicates with backend using REST APIs  
- Backend manages authentication and business logic  
- MongoDB stores user and post data  
- Google OAuth ensures secure access  

---

## Installation and Setup (Local Development)  

### 1. Clone the repository  
```bash
git clone https://github.com/AdityaPingle25/UniLink-Repo.git
cd UniLink-Repo

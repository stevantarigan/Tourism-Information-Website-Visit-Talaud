# 🌴 Visit Talaud — Tourism Information Website

<div align="center">

### Discover the Natural Beauty and Cultural Heritage of the Talaud Islands

A responsive web-based tourism information platform designed to introduce, explore, and promote the natural attractions and cultural heritage of the Talaud Islands, Indonesia.

<br>

![React](https://img.shields.io/badge/React.js-2026-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Laravel](https://img.shields.io/badge/Laravel-PHP-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

![Project Status](https://img.shields.io/badge/Project-Academic%20Project-0A66C2?style=flat-square)
![Development](https://img.shields.io/badge/Development-Full%20Stack-2EA44F?style=flat-square)

<br>

**Explore · Discover · Experience Talaud**

</div>

---

## 🌊 About The Project

**Visit Talaud** is a web-based tourism information system developed to support the digital promotion of tourism destinations in the Talaud Islands, North Sulawesi, Indonesia.

The platform provides visitors with information about natural attractions, cultural heritage, traditional practices, photo galleries, and tourism-related articles through an accessible and responsive interface.

In addition to the public-facing website, Visit Talaud includes an integrated administrative dashboard that allows administrators to manage tourism content and maintain website information efficiently.

The project combines modern frontend development with backend services and relational database management to deliver an integrated tourism information platform.

## ✨ Key Features

### 🌐 Public Website

| Feature | Description |
|---|---|
| 🏠 Homepage | Presents an overview of tourism information and featured content. |
| 🏝️ Tourism Destinations | Displays natural and cultural tourism destinations across the Talaud Islands. |
| 📍 Destination Details | Provides detailed information about each tourism destination. |
| 📊 Popular Destinations | Tracks destination page views to identify destinations receiving the most visitor attention. |
| 🖼️ Photo Gallery | Showcases photographs of tourism attractions and local environments. |
| 🎭 Culture & Traditions | Introduces local cultural heritage and traditional practices. |
| 📰 Tourism Articles | Provides informative articles related to tourism and the Talaud Islands. |
| 📞 Contact Information | Displays contact information and website details. |
| 📱 Responsive Interface | Supports browsing across desktop, tablet, and mobile devices. |

### ⚙️ Admin Dashboard

| Module | Functionality |
|---|---|
| 📊 Dashboard | Provides an administrative interface for website content management. |
| 🖼️ Hero Management | Manages homepage hero section content. |
| 🏝️ Destination Management | Performs CRUD operations for tourism destination information. |
| 📸 Gallery Management | Manages photographs displayed in the website gallery. |
| 🎭 Culture Management | Manages information about local cultures and traditions. |
| 📝 Article Management | Creates, updates, and manages tourism-related articles. |
| 👤 User Management | Manages administrator account information. |
| 📞 Contact & Footer | Updates website contact and footer information. |

## 🧰 Technology Stack

<div align="center">

### Frontend Development

![React](https://skillicons.dev/icons?i=react,js,html,css)

### Backend Development

![Backend](https://skillicons.dev/icons?i=php,laravel)

### Database & Development Tools

![Tools](https://skillicons.dev/icons?i=mysql,git,github,vscode,postman)

</div>

| Category | Technology |
|---|---|
| Frontend | React.js |
| Programming Language | JavaScript, PHP |
| Backend Framework | Laravel |
| Database | MySQL |
| Web Technologies | HTML5, CSS3 |
| API Communication | RESTful API |
| Version Control | Git & GitHub |
| Development Environment | Visual Studio Code |

## 🏗️ System Architecture

Visit Talaud uses a frontend-backend architecture that separates the presentation layer from backend processing and data management.

<div align="center">

```text
┌───────────────────────────────┐
│          USER / ADMIN         │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│         REACT.JS              │
│       Frontend Interface      │
│                               │
│  Public Website & Dashboard   │
└───────────────┬───────────────┘
                │
                │ HTTP Requests
                │ API Communication
                ▼
┌───────────────────────────────┐
│           LARAVEL             │
│       Backend Application     │
│                               │
│  Routing, Business Logic,     │
│  Data Processing & API        │
└───────────────┬───────────────┘
                │
                │ Database Queries
                ▼
┌───────────────────────────────┐
│            MySQL              │
│       Relational Database     │
│                               │
│  Destinations, Gallery,       │
│  Culture, Articles & Users    │
└───────────────────────────────┘
```

</div>

### Application Workflow

1. Visitors or administrators access the application through the React.js interface.
2. React.js communicates with the Laravel backend through API requests.
3. Laravel processes incoming requests and handles application logic.
4. The backend retrieves or updates information in the MySQL database.
5. Laravel returns the required response to the frontend.
6. React.js displays the processed information to the user.

## 📊 Destination Popularity Tracking

Visit Talaud implements a destination popularity tracking mechanism based on page views.

Each destination has a `view_count` attribute that records the number of visits to its detail page. This information is used to identify destinations that receive the most attention from website visitors.

The destination listing can be ordered using the following criteria:

- Primary sorting: Highest destination page-view count.
- Secondary sorting: Latest destination information when view counts are equal.

This feature provides an overview of visitor interest and supports the presentation of destination popularity information.

## 🧪 Testing & Usability Evaluation

The system undergoes usability and functional evaluation to assess its functionality and user experience.

| Testing Method | Purpose |
|---|---|
| System Usability Scale (SUS) | Evaluates users' perceived usability through a standardized questionnaire. |
| Task-Based Testing | Evaluates visitors' and administrators' ability to complete predefined tasks. |
| Success Rate | Measures the percentage of successfully completed tasks. |
| Error Rate | Measures errors encountered during task execution. |

These evaluation methods help identify usability issues and assess whether the website supports its intended users effectively.

## 🎯 Project Objectives

- Promote the natural tourism potential of the Talaud Islands through digital media.
- Introduce local culture, traditions, and regional tourism information.
- Provide visitors with an accessible source of tourism information.
- Simplify website content management through an integrated admin dashboard.
- Present destination popularity information based on recorded page views.
- Develop a responsive tourism information system using modern web technologies.

## 📁 Main Application Modules

```text
Visit Talaud
│
├── Public Website
│   ├── Homepage
│   ├── Destinations
│   ├── Destination Details
│   ├── Gallery
│   ├── Culture & Traditions
│   ├── Articles
│   └── Contact
│
├── Admin Dashboard
│   ├── Dashboard
│   ├── Hero Management
│   ├── Destination Management
│   ├── Gallery Management
│   ├── Culture Management
│   ├── Article Management
│   ├── User Management
│   └── Contact & Footer Management
│
└── Backend Services
    ├── Laravel Application
    ├── RESTful API
    └── MySQL Database
```

## 👨‍💻 Project Information

| Information | Details |
|---|---|
| Project Name | Visit Talaud |
| Project Category | Tourism Information System |
| Development Type | Full Stack Web Development |
| Development Year | 2026 |
| Developer | Stevan Tarigan |
| Frontend | React.js |
| Backend | Laravel |
| Database | MySQL |

## 👨‍💻 Developer

<div align="center">

### Stevan Tarigan

**Full Stack Developer**

Information Systems Graduate · Web & Backend Development

[![GitHub](https://img.shields.io/badge/GitHub-stevantarigan-181717?style=for-the-badge&logo=github)](https://github.com/stevantarigan)

<br>

*Building digital solutions through technology and continuous learning.*

**Designed & Developed with ❤️**

</div>

---

<div align="center">

⭐ If you find this project interesting, feel free to explore the repository!

</div>

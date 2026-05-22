# 🏦 FinVault — Secure Financial Backend

> **Banking-grade REST API backend** — JWT authentication, access-controlled endpoints, and production-standard security architecture.

[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![REST API](https://img.shields.io/badge/REST_API-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://restfulapi.net/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📌 Overview

**FinVault** is a secure, production-grade financial backend built with Java and Spring Boot. Designed to banking-level security standards, it features JWT-based stateless authentication, role-based access control, and a clean RESTful API layer for financial operations.

Built as part of a real-world assignment for **Zorvyn**, demonstrating enterprise backend architecture and security hardening best practices.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Stateless, token-based secure auth |
| 🛡️ **Access Control** | Role-based endpoint protection |
| 🏗️ **Clean Architecture** | Controller → Service → Repository layering |
| 📡 **RESTful API** | Fully documented endpoints |
| 💾 **Data Layer** | Secure, validated data access |
| ⚡ **Spring Boot** | Production-ready configuration |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Language** | Java 17+ |
| **Framework** | Spring Boot |
| **Auth** | JWT (JSON Web Tokens) |
| **API Style** | RESTful |
| **Build Tool** | Maven |

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+

### Installation

```bash
# Clone the repository
git clone https://github.com/Bharathraj6868/finvault-backend.git
cd finvault-backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

### Environment Configuration

Create `application.properties` or set environment variables:

```properties
# Server
server.port=8080

# JWT
jwt.secret=your_secret_key_here
jwt.expiration=86400000

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/finvault
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
```

---

## 📁 Project Structure

```
finvault-backend/
├── src/
│   └── main/
│       ├── java/com/finvault/
│       │   ├── controller/      # REST controllers
│       │   ├── service/         # Business logic layer
│       │   ├── repository/      # Data access layer
│       │   ├── model/           # Entity classes
│       │   ├── dto/             # Data transfer objects
│       │   ├── security/        # JWT filter, config
│       │   └── config/          # App configuration
│       └── resources/
│           └── application.properties
├── pom.xml
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register user | ❌ |
| `POST` | `/api/auth/login` | Login & receive JWT | ❌ |
| `GET` | `/api/account/balance` | View account balance | ✅ |
| `POST` | `/api/transactions` | Create transaction | ✅ |
| `GET` | `/api/transactions/history` | View transaction history | ✅ |

---

## 🔐 Security Architecture

```
Client Request
      │
      ▼
JWT Filter (validates token)
      │
      ▼
Spring Security (role check)
      │
      ▼
Controller → Service → Repository
```

- Tokens are stateless — no server-side session storage
- All sensitive endpoints require valid Bearer token
- Passwords hashed with BCrypt
- Input validation at controller layer

---

## 👤 Author

**Bharath B S**
- GitHub: [@Bharathraj6868](https://github.com/Bharathraj6868)
- LinkedIn: [linkedin.com/in/bharath-bs9148827297](https://linkedin.com/in/bharath-bs9148827297)
- Email: [bharathraj6868@gmail.com](mailto:bharathraj6868@gmail.com)

---

*Enterprise-grade backend · Spring Boot · Bangalore, India*

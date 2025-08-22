# 🏥 Disaster Relief Management System

A comprehensive disaster relief management platform that connects shelters with supporters to efficiently manage and distribute emergency supplies during disasters.

## 🌟 Features

- **Shelter Management**: Register and manage disaster shelters
- **Supply Management**: Track inventory and manage emergency supplies
- **Supporter Portal**: Allow supporters to donate and manage supplies
- **Real-time Inventory**: Monitor supply levels and needs in real-time
- **Rakuten Integration**: Seamless integration with Rakuten API for product management
- **Multi-language Support**: Japanese and Chinese language support
- **Responsive Design**: Modern UI that works on all devices

## 🛠 Tech Stack

### Frontend
- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling framework
- **ESLint** - Code linting

### Backend
- **Spring Boot 3.5.4** - Java framework
- **Java 21** - Programming language
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database access
- **Flyway** - Database migration
- **OpenAPI/Swagger** - API documentation

### Database
- **PostgreSQL 13** - Primary database (Docker)
- **SQLite** - Local development database
- **Hibernate** - ORM framework

### DevOps
- **Docker & Docker Compose** - Containerization
- **Gradle** - Build tool
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- Node.js 20+ (for local development)
- Java 21+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/kenpeitai/team2.git
   cd team2
   ```

2. **Start all services**
   ```bash
   docker compose up
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger-ui.html

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 📁 Project Structure

```
team2/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/            # Utility libraries
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── backend/                 # Spring Boot backend application
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── build.gradle
├── compose.yaml            # Docker Compose configuration
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Frontend
- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL (default: http://localhost:8080)

#### Backend
- `SPRING_PROFILES_ACTIVE`: Active profile (docker/local)
- `JAVA_OPTS`: JVM options (default: -Xmx512m -Xms256m)

#### Database
- `POSTGRES_DB`: Database name (default: demo)
- `POSTGRES_USER`: Database user (default: demo)
- `POSTGRES_PASSWORD`: Database password (default: demo123)

## 📚 API Documentation

The API documentation is available at:
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Key Endpoints

- `GET /api/health` - Health check
- `GET /api/shelters` - List all shelters
- `POST /api/shelters` - Create new shelter
- `GET /api/supplies` - List all supplies
- `POST /api/supplies` - Add new supply

## 🌍 Internationalization

The application supports multiple languages:
- **Japanese** (日本語)
- **Chinese** (中文)

Language-specific documentation is available in the root directory:
- `API_Documentation_JP.md` - Japanese API documentation
- `ARCHITECTURE_SUMMARY_JP.md` - Japanese architecture overview
- `DATABASE_SCHEMA_JP.md` - Japanese database schema

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Windows
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
   
   # Linux/macOS
   lsof -ti:8080 | xargs kill -9
   ```

2. **Docker not starting**
   - Ensure Docker Desktop is running
   - Check Docker service status: `docker info`

3. **Database connection issues**
   - Verify database container is healthy: `docker compose ps`
   - Check database logs: `docker compose logs database`

### Health Checks

- **System Health**: http://localhost:8080/api/health/system
- **Database Health**: http://localhost:8080/api/health/database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` directory
- Review the troubleshooting section above

## 🔄 Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Develop and test locally
   - Submit pull request

2. **Testing**
   - Run backend tests: `./gradlew test`
   - Run frontend tests: `npm test`
   - Manual testing in browser

3. **Deployment**
   - Build Docker images: `docker compose build`
   - Deploy to staging/production environment

---

**Built with ❤️ for disaster relief management**

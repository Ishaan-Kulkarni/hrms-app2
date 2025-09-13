# HRMS Full Stack Application Setup

## Project Structure
```
hrms-app/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── employeeController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Employee.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── employees.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.js
│   │   │   ├── Employees/
│   │   │   │   ├── EmployeeList.js
│   │   │   │   ├── EmployeeForm.js
│   │   │   │   └── EmployeeDetail.js
│   │   │   ├── Layout/
│   │   │   │   ├── Header.js
│   │   │   │   └── Sidebar.js
│   │   │   └── Common/
│   │   │       └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── README.md
```

## Setup Instructions

### 1. Create Project Directory
```bash
mkdir hrms-app
cd hrms-app
```

### 2. Backend Setup
```bash
mkdir backend
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv nodemon
```

### 3. Frontend Setup
```bash
cd ..
npx create-react-app frontend
cd frontend
npm install axios react-router-dom
```

### 4. Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hrms
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
NODE_ENV=development
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Running the Application

**Start Backend (from backend directory):**
```bash
npm run dev
```

**Start Frontend (from frontend directory):**
```bash
npm start
```

### 6. Default Login Credentials
After running the backend, you can register a new user or use these test credentials:
- Email: admin@hrms.com
- Password: admin123

### 7. Features Included
- User Authentication (Login/Register)
- Employee Management (CRUD operations)
- Dashboard with statistics
- Responsive design
- JWT token-based authentication
- MongoDB integration
- Form validation
- Protected routes

### 8. Database Setup
Make sure MongoDB is installed and running on your system:
- Install MongoDB Community Edition
- Start MongoDB service
- The application will automatically create the database and collections

### 9. API Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/employees - Get all employees
- POST /api/employees - Create new employee
- GET /api/employees/:id - Get employee by ID
- PUT /api/employees/:id - Update employee
- DELETE /api/employees/:id - Delete employee

### 10. Technologies Used
**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- React.js
- React Router for navigation
- Axios for API calls
- CSS3 for styling
- Context API for state management

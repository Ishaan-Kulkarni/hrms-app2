import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import EmployeeList from './components/Employees/EmployeeList';
import Sidebar from './components/Layout/Sidebar';
import PrivateRoute from './components/Common/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Private routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <div className="layout">
                    <Sidebar />
                    <main className="main-content">
                      <Dashboard />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            
            <Route
              path="/employees"
              element={
                <PrivateRoute>
                  <div className="layout">
                    <Sidebar />
                    <main className="main-content">
                      <EmployeeList />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../Layout/Header';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    terminatedEmployees: 0,
    departmentStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await employeeAPI.getStats();
      console.log('Dashboard stats response:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Stats fetch error:', error.response?.data || error.message);
      // For employees, show limited error message
      if (user?.role === 'employee') {
        setError('Welcome to the HRMS system! Limited dashboard access for employees.');
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content">
        <Header title="Dashboard" />
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  // Employee-specific dashboard
  if (user?.role === 'employee') {
    return (
      <div className="content">
        <Header title="Employee Dashboard" />
        
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#667eea', marginBottom: '20px' }}>
            Welcome to HRMS, {user.name}! 👋
          </h2>
          
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '10px',
            marginBottom: '25px'
          }}>
            <h3 style={{ marginBottom: '10px' }}>Your Role: Employee</h3>
            <p>You have access to view employee directory and your profile information.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginBottom: '25px'
          }}>
            <div style={{
              background: '#f7fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0'
            }}>
              <h4 style={{ color: '#2d3748' }}>👥 View Employees</h4>
              <p style={{ color: '#4a5568', fontSize: '14px' }}>
                Browse company employee directory
              </p>
            </div>
            
            <div style={{
              background: '#f7fafc',
              padding: '20px',
              borderRadius: '8px',
              border: '2px solid #e2e8f0'
            }}>
              <h4 style={{ color: '#2d3748' }}>📋 Your Profile</h4>
              <p style={{ color: '#4a5568', fontSize: '14px' }}>
                View your employee information
              </p>
            </div>
          </div>

          <div style={{ 
            background: '#e6fffa',
            border: '2px solid #81e6d9',
            padding: '15px',
            borderRadius: '8px',
            color: '#234e52'
          }}>
            <p><strong>📌 Note:</strong> Full HR management features are available to HR and Admin users only.</p>
          </div>
        </div>
      </div>
    );
  }

  // HR/Admin dashboard with full statistics
  if (error && user?.role !== 'employee') {
    return (
      <div className="content">
        <Header title="Dashboard" />
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="content">
      <Header title="HR Dashboard" />
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.totalEmployees}</h3>
          <p>Total Employees</p>
        </div>
        
        <div className="stat-card">
          <h3>{stats.activeEmployees}</h3>
          <p>Active Employees</p>
        </div>
        
        <div className="stat-card">
          <h3>{stats.inactiveEmployees}</h3>
          <p>Inactive Employees</p>
        </div>

        {stats.terminatedEmployees !== undefined && (
          <div className="stat-card">
            <h3>{stats.terminatedEmployees}</h3>
            <p>Terminated Employees</p>
          </div>
        )}
      </div>

      <div style={{ background: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ marginBottom: '20px', color: '#2d3748' }}>Department Distribution</h3>
        
        {stats.departmentStats.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {stats.departmentStats.map((dept, index) => (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 15px',
                  background: '#f7fafc',
                  borderRadius: '6px'
                }}
              >
                <span style={{ fontWeight: '500' }}>{dept._id}</span>
                <span style={{ 
                  background: '#667eea',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '15px',
                  fontSize: '14px'
                }}>
                  {dept.count} employees
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#4a5568', textAlign: 'center' }}>No department data available</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
// src/components/Employees/MyProfile.js
import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../Layout/Header';

const MyProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      console.log('Fetching profile for user:', user.email);
      const response = await employeeAPI.getMyProfile();
      console.log('Profile response:', response.data);
      setEmployee(response.data.employee);
    } catch (error) {
      console.error('Profile fetch error:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        setError('Employee profile not found. Please contact HR to create your employee record.');
      } else {
        setError('Failed to fetch your profile. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="content">
        <Header title="My Profile" />
        <div className="loading">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content">
        <Header title="My Profile" />
        <div className="error">{error}</div>
        
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#2d3748', marginBottom: '15px' }}>Account Information</h3>
          <div style={{
            background: '#f7fafc',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Account Created:</strong> Active</p>
          </div>
          
          <div style={{
            background: '#fff5f5',
            border: '2px solid #feb2b2',
            padding: '15px',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <p style={{ color: '#c53030' }}>
              <strong>⚠️ Note:</strong> Your employee profile hasn't been created yet. 
              Please contact HR to set up your complete employee record with salary, 
              department, and other details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <Header title="My Profile" />
      
      <div style={{ 
        background: 'white', 
        borderRadius: '10px', 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Profile Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 15px auto',
            fontSize: '36px'
          }}>
            👤
          </div>
          <h2>{employee.firstName} {employee.lastName}</h2>
          <p style={{ opacity: '0.9' }}>{employee.position}</p>
          <p style={{ opacity: '0.8' }}>Employee ID: {employee.employeeId}</p>
        </div>

        {/* Profile Content */}
        <div style={{ padding: '30px' }}>
          {/* Basic Information */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#2d3748', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              Basic Information
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '5px' }}>
                  Email Address
                </label>
                <p style={{ 
                  background: '#f7fafc', 
                  padding: '10px', 
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  {employee.email}
                </p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '5px' }}>
                  Phone Number
                </label>
                <p style={{ 
                  background: '#f7fafc', 
                  padding: '10px', 
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  {employee.phone}
                </p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '5px' }}>
                  Department
                </label>
                <p style={{ 
                  background: '#f7fafc', 
                  padding: '10px', 
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  {employee.department}
                </p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '5px' }}>
                  Status
                </label>
                <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                  {employee.status}
                </span>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#2d3748', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              Employment Details
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '5px' }}>
                  Annual Salary
                </label>
                <p style={{ 
                  background: '#f0fff4', 
                  padding: '10px', 
                  borderRadius: '6px',
                  border: '1px solid #9ae6b4',
                  color: '#22543d',
                  fontWeight: '600'
                }}>
                  {formatCurrency(employee.salary)}
                </p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '5px' }}>
                  Hire Date
                </label>
                <p style={{ 
                  background: '#f7fafc', 
                  padding: '10px', 
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  {formatDate(employee.hireDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {employee.address && (employee.address.street || employee.address.city) && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#2d3748', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                Address
              </h3>
              <div style={{ 
                background: '#f7fafc', 
                padding: '15px', 
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>
                <p>{employee.address.street}</p>
                <p>{employee.address.city}, {employee.address.state} {employee.address.zipCode}</p>
                <p>{employee.address.country}</p>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {employee.emergencyContact && employee.emergencyContact.name && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#2d3748', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
                Emergency Contact
              </h3>
              <div style={{ 
                background: '#fff5f5', 
                padding: '15px', 
                borderRadius: '6px',
                border: '1px solid #feb2b2'
              }}>
                <p><strong>Name:</strong> {employee.emergencyContact.name}</p>
                <p><strong>Relationship:</strong> {employee.emergencyContact.relationship}</p>
                <p><strong>Phone:</strong> {employee.emergencyContact.phone}</p>
              </div>
            </div>
          )}

          {/* System Information */}
          <div>
            <h3 style={{ color: '#2d3748', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              System Information
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '20px' 
            }}>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '5px' }}>
                  Profile Created
                </label>
                <p style={{ 
                  background: '#f7fafc', 
                  padding: '10px', 
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  {formatDate(employee.createdAt)}
                </p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568', display: 'block', marginBottom: '5px' }}>
                  Last Updated
                </label>
                <p style={{ 
                  background: '#f7fafc', 
                  padding: '10px', 
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  {formatDate(employee.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact HR Note */}
      <div style={{
        background: '#e6fffa',
        border: '2px solid #81e6d9',
        padding: '15px',
        borderRadius: '8px',
        marginTop: '20px',
        textAlign: 'center'
      }}>
        <p style={{ color: '#234e52' }}>
          <strong>📞 Need to update your information?</strong> Contact HR at hr@hrms.com or visit the HR department.
        </p>
      </div>
    </div>
  );
};

export default MyProfile;
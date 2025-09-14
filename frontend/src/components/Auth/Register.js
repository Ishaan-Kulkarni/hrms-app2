import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    // Employee-specific fields
    phone: '',
    department: '',
    position: '',
    salary: '',
    hireDate: new Date().toISOString().split('T')[0], // Today's date
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Employee-specific validation
    if (formData.role === 'employee') {
      if (!formData.phone || !formData.department || !formData.position || !formData.salary) {
        setError('Please fill in all required employee information');
        return;
      }

      if (formData.salary <= 0) {
        setError('Please enter a valid salary amount');
        return;
      }
    }

    setLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    // Add employee data if registering as employee
    if (formData.role === 'employee') {
      userData.employeeData = {
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ').slice(1).join(' ') || 'N/A',
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        salary: parseFloat(formData.salary),
        hireDate: formData.hireDate,
        address: formData.address,
        emergencyContact: formData.emergencyContact
      };
    }

    const result = await register(userData);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];
  const relationships = ['Parent', 'Spouse', 'Sibling', 'Child', 'Friend', 'Other'];

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <h2>Register for HRMS</h2>
        
        {error && <div className="error">{error}</div>}
        
        {/* Basic Information */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="role">Role *</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Employee-specific fields */}
        {formData.role === 'employee' && (
          <>
            <h3 style={{ margin: '20px 0 10px 0', color: '#2d3748', borderTop: '2px solid #e2e8f0', paddingTop: '20px' }}>
              Employee Information
            </h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="position">Position *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary">Annual Salary (USD) *</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  placeholder="50000"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="hireDate">Hire Date *</label>
              <input
                type="date"
                id="hireDate"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                required
              />
            </div>

            <h4 style={{ margin: '20px 0 10px 0', color: '#2d3748' }}>Address</h4>
            
            <div className="form-group">
              <label htmlFor="address.street">Street Address</label>
              <input
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                placeholder="123 Main Street"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.city">City</label>
                <input
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="New York"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.state">State</label>
                <input
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address.zipCode">Zip Code</label>
                <input
                  type="text"
                  id="address.zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address.country">Country</label>
                <input
                  type="text"
                  id="address.country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  placeholder="USA"
                />
              </div>
            </div>

            <h4 style={{ margin: '20px 0 10px 0', color: '#2d3748' }}>Emergency Contact</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergencyContact.name">Contact Name</label>
                <input
                  type="text"
                  id="emergencyContact.name"
                  name="emergencyContact.name"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContact.relationship">Relationship</label>
                <select
                  id="emergencyContact.relationship"
                  name="emergencyContact.relationship"
                  value={formData.emergencyContact.relationship}
                  onChange={handleChange}
                >
                  <option value="">Select Relationship</option>
                  {relationships.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emergencyContact.phone">Contact Phone</label>
              <input
                type="tel"
                id="emergencyContact.phone"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleChange}
                placeholder="+1234567890"
              />
            </div>
          </>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{ marginTop: '20px' }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
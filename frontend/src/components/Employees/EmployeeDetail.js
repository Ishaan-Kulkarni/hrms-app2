import React from 'react';

const EmployeeDetail = ({ employee, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Employee Details</h2>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Basic Information */}
          <div>
            <h3 style={{ color: '#2d3748', marginBottom: '15px' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Employee ID:</label>
                <p>{employee.employeeId}</p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Full Name:</label>
                <p>{employee.firstName} {employee.lastName}</p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Email:</label>
                <p>{employee.email}</p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Phone:</label>
                <p>{employee.phone}</p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Department:</label>
                <p>{employee.department}</p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Position:</label>
                <p>{employee.position}</p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Salary:</label>
                <p>{formatCurrency(employee.salary)}</p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Hire Date:</label>
                <p>{formatDate(employee.hireDate)}</p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Status:</label>
                <p>
                  <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                    {employee.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {employee.address && (
            <div>
              <h3 style={{ color: '#2d3748', marginBottom: '15px' }}>Address</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontWeight: '500', color: '#4a5568' }}>Street:</label>
                  <p>{employee.address.street || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ fontWeight: '500', color: '#4a5568' }}>City:</label>
                  <p>{employee.address.city || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ fontWeight: '500', color: '#4a5568' }}>State:</label>
                  <p>{employee.address.state || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ fontWeight: '500', color: '#4a5568' }}>Zip Code:</label>
                  <p>{employee.address.zipCode || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ fontWeight: '500', color: '#4a5568' }}>Country:</label>
                  <p>{employee.address.country || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {employee.emergencyContact && (
            <div>
              <h3 style={{ color: '#2d3748', marginBottom: '15px' }}>Emergency Contact</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontWeight: '500', color: '#4a5568' }}>Name:</label>
                  <p>{employee.emergencyContact.name || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ fontWeight: '500', color: '#4a5568' }}>Relationship:</label>
                  <p>{employee.emergencyContact.relationship || 'N/A'}</p>
                </div>
                <div>
                  <label style={{ fontWeight: '500', color: '#4a5568' }}>Phone:</label>
                  <p>{employee.emergencyContact.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h3 style={{ color: '#2d3748', marginBottom: '15px' }}>Sssssystem Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Created Date:</label>
                <p>{formatDate(employee.createdAt)}</p>
              </div>
              <div>
                <label style={{ fontWeight: '500', color: '#4a5568' }}>Last Updated:</label>
                <p>{formatDate(employee.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
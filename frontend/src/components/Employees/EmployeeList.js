import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Header from '../Layout/Header';
import EmployeeForm from './EmployeeForm';
import EmployeeDetail from './EmployeeDetail';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Filters and pagination
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const { user } = useAuth();
  const canModify = user?.role === 'admin' || user?.role === 'hr';

  console.log('Current user:', user); // Debug log
  console.log('Can modify:', canModify); // Debug log

  useEffect(() => {
    fetchEmployees();
  }, [search, department, status, currentPage]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(search && { search }),
        ...(department && { department }),
        ...(status && { status }),
      };

      const response = await employeeAPI.getAll(params);
      setEmployees(response.data.employees);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
      setError(''); // Clear any previous errors
    } catch (error) {
      setError('Failed to fetch employees');
      console.error('Fetch employees error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    console.log('Add employee clicked'); // Debug log
    setSelectedEmployee(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    console.log('Edit employee clicked:', employee.employeeId); // Debug log
    setSelectedEmployee(employee);
    setEditMode(true);
    setShowForm(true);
  };

  const handleView = (employee) => {
    console.log('View employee clicked:', employee.employeeId); // Debug log
    setSelectedEmployee(employee);
    setShowDetail(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        await employeeAPI.delete(id);
        setError('');
        fetchEmployees(); // Refresh the list
      } catch (error) {
        setError('Failed to delete employee: ' + (error.response?.data?.message || error.message));
        console.error('Delete employee error:', error);
      }
    }
  };

  const handleFormSubmit = async (employeeData) => {
    try {
      if (editMode && selectedEmployee) {
        console.log('Updating employee:', selectedEmployee.employeeId); // Debug log
        await employeeAPI.update(selectedEmployee._id, employeeData);
      } else {
        console.log('Creating new employee'); // Debug log
        await employeeAPI.create(employeeData);
      }
      setShowForm(false);
      setError(''); // Clear any errors
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Form submit error:', error);
      throw new Error(error.response?.data?.message || 'Operation failed');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setDepartment('');
    setStatus('');
    setCurrentPage(1);
  };

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];
  const statuses = ['Active', 'Inactive', 'Terminated'];

  return (
    <div className="content">
      <Header title="Employee Management" />
      
      {error && <div className="error">{error}</div>}
      
      {/* Debug info - Remove this after testing */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          background: '#f0f8ff',
          border: '1px solid #ccc',
          padding: '10px',
          margin: '10px 0',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>Debug Info:</strong><br/>
          User Role: {user?.role || 'undefined'}<br/>
          User Name: {user?.name || 'undefined'}<br/>
          User Email: {user?.email || 'undefined'}<br/>
          Can Modify: {canModify ? 'YES' : 'NO'}<br/>
          Show Add Button: {canModify ? 'SHOULD BE VISIBLE' : 'HIDDEN'}
        </div>
      )}
      
      <div className="employee-header">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search employees..."
            className="search-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          
          <select
            className="filter-select"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          
          <select
            className="filter-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Statuses</option>
            {statuses.map(stat => (
              <option key={stat} value={stat}>{stat}</option>
            ))}
          </select>
          
          <button onClick={resetFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
        
        {canModify && (
          <div style={{ marginLeft: 'auto' }}>
            <button 
              onClick={handleAdd} 
              className="btn btn-primary"
              style={{ 
                background: '#667eea',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px'
              }}
            >
              + Add Employee
            </button>
          </div>
        )}
      </div>

      {/* Show role-appropriate message */}
      {user?.role === 'employee' && (
        <div style={{
          background: '#e6fffa',
          border: '2px solid #81e6d9',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#234e52'
        }}>
          <p><strong>👀 Employee Directory:</strong> You can view all company employees. HR and Admin users have additional management capabilities.</p>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading employees...</div>
      ) : (
        <>
          <div className="employee-table">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.employeeId}</td>
                      <td>{employee.firstName} {employee.lastName}</td>
                      <td>{employee.email}</td>
                      <td>{employee.department}</td>
                      <td>{employee.position}</td>
                      <td>
                        <span className={`status-badge status-${employee.status.toLowerCase()}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            onClick={() => handleView(employee)}
                            className="btn btn-sm btn-secondary"
                          >
                            View
                          </button>
                          {canModify && (
                            <>
                              <button 
                                onClick={() => handleEdit(employee)}
                                className="btn btn-sm btn-primary"
                              >
                                Edit
                              </button>
                              {user?.role === 'admin' && (
                                <button 
                                  onClick={() => handleDelete(employee._id)}
                                  className="btn btn-sm btn-danger"
                                >
                                  Delete
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                      {search || department || status ? 'No employees match your filters' : 'No employees found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <span>
                Page {currentPage} of {totalPages} ({total} total employees)
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          isEdit={editMode}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedEmployee(null);
            setEditMode(false);
          }}
        />
      )}

      {/* Employee Detail Modal */}
      {showDetail && selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          onClose={() => {
            setShowDetail(false);
            setSelectedEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default EmployeeList;
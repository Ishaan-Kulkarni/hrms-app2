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
    } catch (error) {
      setError('Failed to fetch employees');
      console.error('Fetch employees error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditMode(true);
    setShowForm(true);
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setShowDetail(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchEmployees();
      } catch (error) {
        setError('Failed to delete employee');
        console.error('Delete employee error:', error);
      }
    }
  };

  const handleFormSubmit = async (employeeData) => {
    try {
      if (editMode && selectedEmployee) {
        await employeeAPI.update(selectedEmployee._id, employeeData);
      } else {
        await employeeAPI.create(employeeData);
      }
      setShowForm(false);
      fetchEmployees();
    } catch (error) {
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
          <button onClick={handleAdd} className="btn btn-primary">
            Add Employee
          </button>
        )}
      </div>

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
                      No employees found
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
                Page {currentPage} of {totalPages} ({total} total)
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

      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          isEdit={editMode}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {showDetail && selectedEmployee && (
        <EmployeeDetail
          employee={selectedEmployee}
          onClose={() => setShowDetail(false)}
        />
      )}
    </div>
  );
};

export default EmployeeList;
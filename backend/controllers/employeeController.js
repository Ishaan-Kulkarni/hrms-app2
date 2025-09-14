const Employee = require('../models/Employee');

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, status } = req.query;
    
    const query = {};
    
    // Add search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by department
    if (department) {
      query.department = department;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }

    const employees = await Employee.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error while fetching employees' });
  }
};

// Get single employee
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ message: 'Server error while fetching employee' });
  }
};

// Get current user's employee profile
const getMyProfile = async (req, res) => {
  try {
    const userEmail = req.user.email;
    console.log('Getting profile for user email:', userEmail);
    
    const employee = await Employee.findOne({ email: userEmail });
    
    if (!employee) {
      return res.status(404).json({ 
        message: 'Employee profile not found. Please contact HR to create your employee record.' 
      });
    }

    res.json({ 
      employee,
      message: 'Profile retrieved successfully' 
    });
  } catch (error) {
    console.error('Get my profile error:', error);
    res.status(500).json({ message: 'Server error while fetching your profile' });
  }
};

// Create employee
const createEmployee = async (req, res) => {
  try {
    // Generate employeeId manually
    const employeeCount = await Employee.countDocuments();
    const employeeId = `EMP${String(employeeCount + 1).padStart(4, '0')}`;
    
    console.log('Creating employee with ID:', employeeId);
    
    const employee = new Employee({
      ...req.body,
      employeeId: employeeId,
      status: req.body.status || 'Active' // Default to Active if not provided
    });
    
    await employee.save();
    
    console.log('Employee created successfully:', employee.employeeId);
    
    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        message: `Employee with this ${field} already exists` 
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while creating employee' });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ 
        message: `Employee with this ${field} already exists` 
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error while updating employee' });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error while deleting employee' });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    console.log('Getting dashboard stats...');
    
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    const inactiveEmployees = await Employee.countDocuments({ status: 'Inactive' });
    const terminatedEmployees = await Employee.countDocuments({ status: 'Terminated' });
    
    const departmentStats = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const stats = {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      terminatedEmployees,
      departmentStats
    };

    console.log('Dashboard stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  getMyProfile,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats
};
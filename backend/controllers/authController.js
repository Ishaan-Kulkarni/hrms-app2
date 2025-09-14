const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register user
const register = async (req, res) => {
  try {
    const { name, email, password, role, employeeData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // If registering as employee, check if employee email already exists
    if (role === 'employee' && employeeData) {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ message: 'Employee with this email already exists' });
      }
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'employee'
    });

    await user.save();

    // If registering as employee, also create employee record
    if (role === 'employee' && employeeData) {
      try {
        // Generate employee ID manually
        const employeeCount = await Employee.countDocuments();
        const employeeId = `EMP${String(employeeCount + 1).padStart(4, '0')}`;

        const employee = new Employee({
          ...employeeData,
          email: email, // Use the same email as user account
          employeeId: employeeId,
          status: 'Active'
        });

        await employee.save();
        console.log(`Created employee record: ${employeeId} for user: ${email}`);
      } catch (employeeError) {
        // If employee creation fails, delete the user account
        await User.findByIdAndDelete(user._id);
        console.error('Employee creation failed, deleted user account:', employeeError);
        
        if (employeeError.code === 11000) {
          return res.status(400).json({ message: 'Employee data validation failed - duplicate entry' });
        }
        
        return res.status(400).json({ 
          message: 'Employee registration failed: ' + (employeeError.message || 'Invalid employee data')
        });
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: role === 'employee' ? 'Employee registered successfully' : 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe
};
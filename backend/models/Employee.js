const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales']
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: 0
  },
  hireDate: {
    type: Date,
    required: [true, 'Hire date is required'],
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Terminated'],
    default: 'Active'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  }
}, {
  timestamps: true
});

// Generate employee ID automatically (fallback if not provided)
employeeSchema.pre('save', async function(next) {
  // Only generate if employeeId is not already set
  if (!this.employeeId) {
    try {
      const count = await mongoose.model('Employee').countDocuments();
      this.employeeId = `EMP${String(count + 1).padStart(4, '0')}`;
      console.log('Auto-generated employeeId:', this.employeeId);
    } catch (error) {
      console.error('Error generating employeeId:', error);
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
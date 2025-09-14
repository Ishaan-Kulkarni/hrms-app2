const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDashboardStats,
  getMyProfile
} = require('../controllers/employeeController');
const { auth, authorize } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// @route   GET /api/employees/my-profile
// @desc    Get current user's employee profile
// @access  Private (All authenticated users)
router.get('/my-profile', getMyProfile);

// @route   GET /api/employees/stats
// @desc    Get dashboard statistics
// @access  Private (All authenticated users can view basic stats)
router.get('/stats', getDashboardStats);

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private (All authenticated users)
router.get('/', getEmployees);

// @route   POST /api/employees
// @desc    Create new employee
// @access  Private (HR/Admin)
router.post('/', authorize('admin', 'hr'), createEmployee);

// @route   GET /api/employees/:id
// @desc    Get single employee
// @access  Private (All authenticated users)
router.get('/:id', getEmployee);

// @route   PUT /api/employees/:id
// @desc    Update employee
// @access  Private (HR/Admin)
router.put('/:id', authorize('admin', 'hr'), updateEmployee);

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), deleteEmployee);

module.exports = router;
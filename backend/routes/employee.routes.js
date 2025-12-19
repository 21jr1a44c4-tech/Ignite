const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee.model');
const { protect, authorize } = require('../middleware/auth.middleware');

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private/HR
router.get('/', protect, authorize('HR'), async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('userId', 'email')
      .populate('onboardingSubmissionId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: employees.length,
      employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employees'
    });
  }
});

// @route   GET /api/employees/active
// @desc    Get all active employees (for welcome emails and dashboard)
// @access  Private
router.get('/active', protect, async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true })
      .select('employeeId email fullName department phone isActive')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      employees
    });
  } catch (error) {
    console.error('Error fetching active employees:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active employees'
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const OnboardingSubmission = require('../models/OnboardingSubmission.model');
const Employee = require('../models/Employee.model');
const User = require('../models/User.model');
const Candidate = require('../models/Candidate.model');
const { protect, authorize } = require('../middleware/auth.middleware');
const { sendWelcomeEmail, sendOnboardingPassEmail } = require('../utils/emailService');
const { sendAllOnboardingEmails } = require('../utils/onboardingEmails');
const { v4: uuidv4 } = require('uuid');

// @route   GET /api/admin/submissions
// @desc    Get all onboarding submissions
// @access  Private/HR
router.get('/submissions', protect, authorize('HR'), async (req, res) => {
  try {
    const submissions = await OnboardingSubmission.find()
      .populate('candidateId')
      .populate('reviewedBy', 'email fullName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions'
    });
  }
});

// @route   GET /api/admin/submissions/:id
// @desc    Get single submission details
// @access  Private/HR
router.get('/submissions/:id', protect, authorize('HR'), async (req, res) => {
  try {
    const submission = await OnboardingSubmission.findById(req.params.id)
      .populate('candidateId')
      .populate('reviewedBy', 'email fullName');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Convert Buffer data to base64 for transmission to frontend
    const submissionObj = submission.toObject();
    
    // Helper function to ensure documents have base64 data
    // Data is already stored as base64 in the database, but handle edge cases
    const ensureBase64 = (doc) => {
      if (!doc) return doc;
      
      if (doc.data) {
        // If it's already a string (base64), return as-is
        if (typeof doc.data === 'string') {
          return doc;
        }
        
        // If it's a Buffer, convert to base64
        if (Buffer.isBuffer(doc.data)) {
          return {
            ...doc,
            data: doc.data.toString('base64')
          };
        }
        
        // If it's a serialized buffer object, convert
        if (typeof doc.data === 'object' && doc.data.type === 'Buffer' && Array.isArray(doc.data.data)) {
          return {
            ...doc,
            data: Buffer.from(doc.data.data).toString('base64')
          };
        }
      }
      return doc;
    };

    // Ensure all document fields have base64 data
    if (submissionObj.tenthCertificate) submissionObj.tenthCertificate = ensureBase64(submissionObj.tenthCertificate);
    if (submissionObj.intermediateCertificate) submissionObj.intermediateCertificate = ensureBase64(submissionObj.intermediateCertificate);
    if (submissionObj.degreeCertificate) submissionObj.degreeCertificate = ensureBase64(submissionObj.degreeCertificate);
    if (submissionObj.semester1_1) submissionObj.semester1_1 = ensureBase64(submissionObj.semester1_1);
    if (submissionObj.semester1_2) submissionObj.semester1_2 = ensureBase64(submissionObj.semester1_2);
    if (submissionObj.semester2_1) submissionObj.semester2_1 = ensureBase64(submissionObj.semester2_1);
    if (submissionObj.semester2_2) submissionObj.semester2_2 = ensureBase64(submissionObj.semester2_2);
    if (submissionObj.semester3_1) submissionObj.semester3_1 = ensureBase64(submissionObj.semester3_1);
    if (submissionObj.semester3_2) submissionObj.semester3_2 = ensureBase64(submissionObj.semester3_2);
    if (submissionObj.semester4_1) submissionObj.semester4_1 = ensureBase64(submissionObj.semester4_1);
    if (submissionObj.semester4_2) submissionObj.semester4_2 = ensureBase64(submissionObj.semester4_2);
    if (submissionObj.provisionalCertificate) submissionObj.provisionalCertificate = ensureBase64(submissionObj.provisionalCertificate);
    if (submissionObj.aadhaarDocument) submissionObj.aadhaarDocument = ensureBase64(submissionObj.aadhaarDocument);
    if (submissionObj.panDocument) submissionObj.panDocument = ensureBase64(submissionObj.panDocument);
    if (submissionObj.addressProof) submissionObj.addressProof = ensureBase64(submissionObj.addressProof);
    if (submissionObj.profilePhoto) submissionObj.profilePhoto = ensureBase64(submissionObj.profilePhoto);
    
    // Convert arrays
    if (submissionObj.additionalCertificates && Array.isArray(submissionObj.additionalCertificates)) {
      submissionObj.additionalCertificates = submissionObj.additionalCertificates.map(ensureBase64);
    }
    if (submissionObj.experienceLetters && Array.isArray(submissionObj.experienceLetters)) {
      submissionObj.experienceLetters = submissionObj.experienceLetters.map(ensureBase64);
    }

    res.json({
      success: true,
      submission: submissionObj
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission'
    });
  }
});

// @route   POST /api/admin/submissions/:id/approve
// @desc    Approve onboarding submission and send onboarding pass
// @access  Private/HR
router.post('/submissions/:id/approve', protect, authorize('HR'), async (req, res) => {
  try {
    const { remarks, dateOfJoining } = req.body;

    const submission = await OnboardingSubmission.findById(req.params.id)
      .populate('candidateId');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    if (submission.status === 'APPROVED' || submission.status === 'PASS_SENT') {
      return res.status(400).json({
        success: false,
        message: 'Submission already approved'
      });
    }

    // Validate date of joining
    if (!dateOfJoining) {
      return res.status(400).json({
        success: false,
        message: 'Date of Joining is required'
      });
    }

    // Generate onboarding pass token
    const onboardingPassToken = uuidv4();

    // Update submission with pass details
    submission.status = 'PASS_SENT';
    submission.hrRemarks = remarks;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = Date.now();
    submission.onboardingPassToken = onboardingPassToken;
    submission.onboardingPassSentAt = Date.now();
    submission.dateOfJoining = new Date(dateOfJoining);
    await submission.save();

    // Send onboarding pass email
    setImmediate(async () => {
      try {
        await sendOnboardingPassEmail(submission, onboardingPassToken);
        console.log('✅ Onboarding Pass email sent to', submission.email);
      } catch (error) {
        console.error('❌ Error sending onboarding pass email:', error);
      }
    });

    res.json({
      success: true,
      message: 'Onboarding approved. Employee needs to accept onboarding pass to complete the process.',
      submission: {
        id: submission._id,
        status: submission.status,
        fullName: submission.fullName,
        email: submission.email
      }
    });
  } catch (error) {
    console.error('Error approving submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving submission: ' + error.message
    });
  }
});

// @route   POST /api/admin/submissions/:id/reject
// @desc    Reject onboarding submission
// @access  Private/HR
router.post('/submissions/:id/reject', protect, authorize('HR'), async (req, res) => {
  try {
    const { remarks } = req.body;

    if (!remarks) {
      return res.status(400).json({
        success: false,
        message: 'Rejection remarks are required'
      });
    }

    const submission = await OnboardingSubmission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    submission.status = 'REJECTED';
    submission.hrRemarks = remarks;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = Date.now();
    await submission.save();

    res.json({
      success: true,
      message: 'Submission rejected',
      submission: {
        id: submission._id,
        status: submission.status,
        remarks: submission.hrRemarks
      }
    });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting submission'
    });
  }
});

// @route   GET /api/admin/onboarding-pass-details/:token
// @desc    Get onboarding pass details by token
// @access  Public
router.get('/onboarding-pass-details/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const submission = await OnboardingSubmission.findOne({
      onboardingPassToken: token,
      status: 'PASS_SENT'
    });

    if (!submission) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired onboarding pass'
      });
    }

    res.json({
      success: true,
      submission: {
        firstName: submission.firstName,
        lastName: submission.lastName,
        email: submission.email,
        department: submission.department,
        dateOfJoining: submission.dateOfJoining
      }
    });
  } catch (error) {
    console.error('Error fetching onboarding pass details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching details'
    });
  }
});

// @route   POST /api/admin/accept-onboarding-pass/:token
// @desc    Accept onboarding pass and create employee
// @access  Public
router.post('/accept-onboarding-pass/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const submission = await OnboardingSubmission.findOne({
      onboardingPassToken: token,
      status: 'PASS_SENT'
    }).populate('candidateId');

    if (!submission) {
      return res.status(400).json({
        success: false,
        message: 'Invalid onboarding pass token or already accepted'
      });
    }

    // Generate Employee ID
    const employeeCount = await Employee.countDocuments();
    const employeeId = `WW${String(employeeCount + 1).padStart(5, '0')}`;

    // Generate initial password
    const namePart = submission.fullName.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const initialPassword = `${namePart}@WW2025`;

    // Find and update user
    const user = await User.findOne({ email: submission.email });
    if (user) {
      user.employeeId = employeeId;
      user.password = initialPassword; // Will be hashed by pre-save hook
      await user.save();
    }

    // Get candidate
    const candidate = await Candidate.findById(submission.candidateId);

    // Create Employee record with all documents
    const employee = new Employee({
      employeeId,
      userId: user._id,
      onboardingSubmissionId: submission._id,
      firstName: submission.firstName || submission.fullName.split(' ')[0],
      lastName: submission.lastName || submission.fullName.split(' ').slice(1).join(' '),
      middleName: submission.middleName,
      fullName: submission.fullName,
      email: submission.email,
      phone: submission.phone,
      dateOfBirth: submission.dateOfBirth,
      linkedinUrl: submission.linkedinUrl,
      department: submission.department,
      position: candidate?.position || 'Software Engineer',
      profilePhoto: submission.profilePhoto?.data ? submission.profilePhoto : undefined,
      aboutMe: submission.selfDescription || submission.aboutMe,
      isActive: true,
      // Store all documents from submission
      documents: {
        tenthCertificate: submission.tenthCertificate,
        intermediateCertificate: submission.intermediateCertificate,
        degreeCertificate: submission.degreeCertificate,
        additionalCertificates: submission.additionalCertificates || [],
        semester1_1: submission.semester1_1,
        semester1_2: submission.semester1_2,
        semester2_1: submission.semester2_1,
        semester2_2: submission.semester2_2,
        semester3_1: submission.semester3_1,
        semester3_2: submission.semester3_2,
        semester4_1: submission.semester4_1,
        semester4_2: submission.semester4_2,
        provisionalCertificate: submission.provisionalCertificate,
        experienceLetters: submission.experienceLetters || [],
        aadhaarDocument: submission.aadhaarDocument,
        panDocument: submission.panDocument,
        addressProof: submission.addressProof,
        profilePhoto: submission.profilePhoto
      }
    });

    await employee.save();

    // Update submission
    submission.status = 'PASS_ACCEPTED';
    submission.employeeCreated = true;
    submission.employeeId = employeeId;
    submission.onboardingPassAcceptedAt = Date.now();
    await submission.save();

    // Send 5 onboarding emails to new employee after 1 minute
    setTimeout(async () => {
      try {
        await sendAllOnboardingEmails(employee, 'Your Manager Name');
        console.log('✅ All 5 onboarding emails sent to new employee after 1 minute');
      } catch (error) {
        console.error('❌ Error sending onboarding emails:', error);
      }
    }, 1 * 60 * 1000); // 1 minute

    // Get all active employees except the new one
    const activeEmployees = await Employee.find({
      isActive: true,
      _id: { $ne: employee._id }
    }).select('email fullName');

    // Send welcome email to all active employees about new joiner immediately
    if (activeEmployees.length > 0) {
      setImmediate(async () => {
        try {
          await sendWelcomeEmail(employee, activeEmployees);
          console.log('✅ New employee welcome email sent to all active employees');
        } catch (error) {
          console.error('❌ Error sending welcome emails to team:', error);
        }
      });
    }

    res.json({
      success: true,
      message: 'Onboarding pass accepted! Welcome to WinWire. You will receive onboarding emails in 1 minute.',
      employee: {
        employeeId: employee.employeeId,
        fullName: employee.fullName,
        email: employee.email,
        department: employee.department
      }
    });
  } catch (error) {
    console.error('Error accepting onboarding pass:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting onboarding pass: ' + error.message
    });
  }
});

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private/HR
router.get('/dashboard/stats', protect, authorize('HR'), async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const acceptedOffers = await Candidate.countDocuments({ offerStatus: 'ACCEPTED' });
    const pendingSubmissions = await OnboardingSubmission.countDocuments({ status: 'SUBMITTED' });
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ isActive: true });

    res.json({
      success: true,
      stats: {
        totalCandidates,
        acceptedOffers,
        pendingSubmissions,
        totalEmployees,
        activeEmployees
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
});

module.exports = router;

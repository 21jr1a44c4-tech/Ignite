const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate.model');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../utils/fileUpload');
const { generateAcceptToken, verifyToken } = require('../utils/jwtUtils');
const { sendOfferEmail, sendJoiningCredentials } = require('../utils/emailService');
const User = require('../models/User.model');
const { v4: uuidv4 } = require('uuid');

// @route   POST /api/candidates
// @desc    Create new candidate and send offer
// @access  Private/HR
router.post('/', protect, authorize('HR'), upload.single('offerLetter'), async (req, res) => {
  try {
    const { fullName, email, phone, position, department } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !position || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Offer letter PDF is required'
      });
    }

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({
        success: false,
        message: 'Candidate with this email already exists'
      });
    }

    
    // Generate accept token
    const acceptToken = uuidv4();
    const acceptTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Create candidate
    const candidate = new Candidate({
      fullName,
      email,
      phone,
      position,
      department,
      offerLetterPath: req.file.path,
      acceptToken,
      acceptTokenExpiry,
      createdBy: req.user._id
    });

    await candidate.save();

    // Send offer email asynchronously
    setImmediate(async () => {
      try {
        await sendOfferEmail(candidate, acceptToken);
      } catch (error) {
        console.error('Error sending offer email:', error);
      }
    });

    res.status(201).json({
      success: true,
      message: 'Candidate created and offer email sent',
      candidate: {
        id: candidate._id,
        fullName: candidate.fullName,
        email: candidate.email,
        position: candidate.position,
        department: candidate.department,
        offerStatus: candidate.offerStatus
      }
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating candidate'
    });
  }
});

// @route   GET /api/candidates
// @desc    Get all candidates
// @access  Private/HR
router.get('/', protect, authorize('HR'), async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'email fullName');

    res.json({
      success: true,
      count: candidates.length,
      candidates
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching candidates'
    });
  }
});

// @route   POST /api/candidates/accept-offer/:token
// @desc    Accept offer
// @access  Public
router.post('/accept-offer/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const candidate = await Candidate.findOne({
      acceptToken: token,
      acceptTokenExpiry: { $gt: Date.now() }
    });

    if (!candidate) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    if (candidate.offerStatus === 'ACCEPTED') {
      return res.status(400).json({
        success: false,
        message: 'Offer already accepted'
      });
    }

    candidate.offerStatus = 'ACCEPTED';
    await candidate.save();

    res.json({
      success: true,
      message: 'Offer accepted successfully',
      candidate: {
        fullName: candidate.fullName,
        position: candidate.position,
        department: candidate.department
      }
    });
  } catch (error) {
    console.error('Error accepting offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting offer'
    });
  }
});

// @route   POST /api/candidates/:id/trigger-joining
// @desc    Trigger joining process
// @access  Private/HR
router.post('/:id/trigger-joining', protect, authorize('HR'), async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    if (candidate.offerStatus !== 'ACCEPTED') {
      return res.status(400).json({
        success: false,
        message: 'Candidate has not accepted the offer yet'
      });
    }

    if (candidate.joiningTriggered) {
      return res.status(400).json({
        success: false,
        message: 'Joining already triggered for this candidate'
      });
    }

    // Generate temporary password
    const namePart = candidate.fullName.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    const tempPassword = `${namePart}@WW2025`;

    // Create user account
    const user = new User({
      email: candidate.email,
      password: tempPassword,
      role: 'EMPLOYEE',
      fullName: candidate.fullName,
      isActive: true
    });

    await user.save();

    // Update candidate
    candidate.joiningTriggered = true;
    candidate.joiningCredentialsSent = true;
    candidate.tempPassword = tempPassword;
    await candidate.save();

    // Send credentials email asynchronously
    setImmediate(async () => {
      try {
        await sendJoiningCredentials(candidate, tempPassword);
      } catch (error) {
        console.error('Error sending credentials email:', error);
      }
    });

    res.json({
      success: true,
      message: 'Joining process triggered and credentials sent',
      credentials: {
        email: candidate.email,
        tempPassword
      }
    });
  } catch (error) {
    console.error('Error triggering joining:', error);
    res.status(500).json({
      success: false,
      message: 'Error triggering joining process'
    });
  }
});

module.exports = router;

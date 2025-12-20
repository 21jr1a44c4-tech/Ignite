const express = require('express');
const router = express.Router();
const OnboardingSubmission = require('../models/OnboardingSubmission.model');
const Candidate = require('../models/Candidate.model');
const { protect } = require('../middleware/auth.middleware');
const { uploadToDatabase, prepareDocumentForDB, prepareDocumentsForDB } = require('../utils/databaseFileUpload');

// @route   POST /api/onboarding/submit
// @desc    Submit onboarding form
// @access  Private/Employee
router.post('/submit', protect, uploadToDatabase.fields([
  // Education certificates
  { name: 'tenthCertificate', maxCount: 1 },
  { name: 'intermediateCertificate', maxCount: 1 },
  { name: 'degreeCertificate', maxCount: 1 },
  { name: 'additionalCertificates', maxCount: 5 },
  // BTech semester certificates
  { name: 'semester1_1', maxCount: 1 },
  { name: 'semester1_2', maxCount: 1 },
  { name: 'semester2_1', maxCount: 1 },
  { name: 'semester2_2', maxCount: 1 },
  { name: 'semester3_1', maxCount: 1 },
  { name: 'semester3_2', maxCount: 1 },
  { name: 'semester4_1', maxCount: 1 },
  { name: 'semester4_2', maxCount: 1 },
  { name: 'provisionalCertificate', maxCount: 1 },
  // Experience
  { name: 'experienceLetters', maxCount: 5 },
  // Identity documents
  { name: 'aadhaarDocument', maxCount: 1 },
  { name: 'panDocument', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  // Profile
  { name: 'profilePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      // Personal details
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      phone,
      linkedinUrl,
      address,
      city,
      state,
      pincode,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      bankAccountNumber,
      bankName,
      bankIFSC,
      selfDescription,
      // Education
      tenthPercentage,
      twelthPercentage,
      degreePercentage,
      // Experience
      totalExperience,
      previousCompanies,
      // Identity
      aadhaarNumber,
      panNumber,
      // Profile
      aboutMe
    } = req.body;

    // Find candidate by user email
    const candidate = await Candidate.findOne({ email: req.user.email });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    // Check if already submitted
    const existingSubmission = await OnboardingSubmission.findOne({ candidateId: candidate._id });
    if (existingSubmission && existingSubmission.status !== 'REJECTED') {
      return res.status(400).json({
        success: false,
        message: 'Onboarding already submitted'
      });
    }

    // Validate required files
    if (!req.files.tenthCertificate || !req.files.intermediateCertificate || 
        !req.files.degreeCertificate || !req.files.aadhaarDocument || 
        !req.files.panDocument || !req.files.addressProof || !req.files.profilePhoto) {
      return res.status(400).json({
        success: false,
        message: 'All required documents must be uploaded'
      });
    }

    // Parse previous companies if it's a string
    let parsedCompanies = [];
    if (previousCompanies) {
      parsedCompanies = typeof previousCompanies === 'string' 
        ? JSON.parse(previousCompanies) 
        : previousCompanies;
    }

    // Validate experience letters for experienced candidates
    if (totalExperience > 0 && (!req.files.experienceLetters || req.files.experienceLetters.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Experience letters are required for experienced candidates'
      });
    }

    // Create submission
    const submission = new OnboardingSubmission({
      candidateId: candidate._id,
      email: candidate.email,
      fullName: candidate.fullName,
      department: candidate.department,
      
      // Personal details
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      phone,
      linkedinUrl,
      address,
      city,
      state,
      pincode,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      bankAccountNumber,
      bankName,
      bankIFSC,
      selfDescription,
      
      // Education percentages
      tenthPercentage: Number(tenthPercentage),
      twelthPercentage: Number(twelthPercentage),
      degreePercentage: Number(degreePercentage),
      
      // Education certificates
      tenthCertificate: prepareDocumentForDB(req.files.tenthCertificate[0]),
      intermediateCertificate: prepareDocumentForDB(req.files.intermediateCertificate[0]),
      degreeCertificate: prepareDocumentForDB(req.files.degreeCertificate[0]),
      additionalCertificates: prepareDocumentsForDB(req.files.additionalCertificates || []),
      
      // BTech semester certificates
      semester1_1: req.files.semester1_1?.[0] ? prepareDocumentForDB(req.files.semester1_1[0]) : undefined,
      semester1_2: req.files.semester1_2?.[0] ? prepareDocumentForDB(req.files.semester1_2[0]) : undefined,
      semester2_1: req.files.semester2_1?.[0] ? prepareDocumentForDB(req.files.semester2_1[0]) : undefined,
      semester2_2: req.files.semester2_2?.[0] ? prepareDocumentForDB(req.files.semester2_2[0]) : undefined,
      semester3_1: req.files.semester3_1?.[0] ? prepareDocumentForDB(req.files.semester3_1[0]) : undefined,
      semester3_2: req.files.semester3_2?.[0] ? prepareDocumentForDB(req.files.semester3_2[0]) : undefined,
      semester4_1: req.files.semester4_1?.[0] ? prepareDocumentForDB(req.files.semester4_1[0]) : undefined,
      semester4_2: req.files.semester4_2?.[0] ? prepareDocumentForDB(req.files.semester4_2[0]) : undefined,
      provisionalCertificate: req.files.provisionalCertificate?.[0] ? prepareDocumentForDB(req.files.provisionalCertificate[0]) : undefined,
      
      // Experience
      totalExperience: Number(totalExperience) || 0,
      previousCompanies: parsedCompanies,
      experienceLetters: prepareDocumentsForDB(req.files.experienceLetters || []),
      
      // Identity
      aadhaarNumber,
      panNumber,
      aadhaarDocument: prepareDocumentForDB(req.files.aadhaarDocument[0]),
      panDocument: prepareDocumentForDB(req.files.panDocument[0]),
      addressProof: prepareDocumentForDB(req.files.addressProof[0]),
      
      // Profile
      profilePhoto: prepareDocumentForDB(req.files.profilePhoto[0]),
      aboutMe,
      
      status: 'SUBMITTED'
    });

    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Onboarding submitted successfully',
      submission: {
        id: submission._id,
        status: submission.status
      }
    });
  } catch (error) {
    console.error('Error submitting onboarding:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting onboarding: ' + error.message
    });
  }
});

// @route   GET /api/onboarding/my-submission
// @desc    Get user's onboarding submission
// @access  Private/Employee
router.get('/my-submission', protect, async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ email: req.user.email });

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found'
      });
    }

    const submission = await OnboardingSubmission.findOne({ candidateId: candidate._id });

    res.json({
      success: true,
      submission,
      candidate: {
        fullName: candidate.fullName,
        email: candidate.email,
        position: candidate.position,
        department: candidate.department
      }
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission'
    });
  }
});

// @route   GET /api/onboarding/submission/:submissionId/details
// @desc    Get full submission details with document data
// @access  Private
router.get('/submission/:submissionId/details', protect, async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await OnboardingSubmission.findById(submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Return full submission with documents
    res.json({
      success: true,
      submission
    });
  } catch (error) {
    console.error('Error fetching submission details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission'
    });
  }
});

module.exports = router;

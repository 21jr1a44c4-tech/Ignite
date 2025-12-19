import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiDownload, FiCheck, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import './SubmissionDetails.css';

const SubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await api.get(`/admin/submissions/${id}`);
      setSubmission(response.data.submission);
    } catch (error) {
      toast.error('Error fetching submission details');
      navigate('/hr/submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!dateOfJoining) {
      toast.error('Please select a Date of Joining');
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/admin/submissions/${id}/approve`, { remarks, dateOfJoining });
      toast.success('Onboarding Pass sent successfully! Employee needs to accept it to activate their account.');
      setShowApproveModal(false);
      navigate('/hr/submissions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error approving submission');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!remarks.trim()) {
      toast.error('Please provide rejection remarks');
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/admin/submissions/${id}/reject`, { remarks });
      toast.success('Submission rejected');
      setShowRejectModal(false);
      navigate('/hr/submissions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rejecting submission');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!submission) {
    return <div>Submission not found</div>;
  }

  return (
    <div className="submission-details-page">
      <div className="page-header">
        <div className="container">
          <Link to="/hr/submissions" className="back-link">
            <FiArrowLeft /> Back to Submissions
          </Link>
        </div>
      </div>

      <div className="container">
        <div className="submission-details-card fade-in">
          <div className="details-header">
            <div className="profile-section">
              {submission.profilePhoto && (
                <img
                  src={`${BACKEND_URL}/uploads/${submission.profilePhoto}`}
                  alt={submission.fullName}
                  className="profile-photo"
                />
              )}
              <div>
                <h1>{submission.fullName}</h1>
                <p>{submission.email}</p>
                <span className={`badge ${
                  submission.status === 'PASS_ACCEPTED' ? 'badge-success' :
                  submission.status === 'PASS_SENT' ? 'badge-info' :
                  submission.status === 'REJECTED' ? 'badge-error' :
                  'badge-warning'
                }`}>
                  {submission.status === 'PASS_SENT' ? 'Pass Sent - Awaiting Employee Acceptance' :
                   submission.status === 'PASS_ACCEPTED' ? 'Activated - Employee Account Created' :
                   submission.status}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="details-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>First Name</label>
                <p>{submission.firstName || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Middle Name</label>
                <p>{submission.middleName || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Last Name</label>
                <p>{submission.lastName || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Date of Birth</label>
                <p>{submission.dateOfBirth ? new Date(submission.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>LinkedIn Profile</label>
                <p>{submission.linkedinUrl ? <a href={submission.linkedinUrl} target="_blank" rel="noopener noreferrer">View Profile</a> : 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Department</label>
                <p>{submission.department}</p>
              </div>
              <div className="info-item">
                <label>Total Experience</label>
                <p>{submission.totalExperience} years</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="details-section">
            <h2>Address</h2>
            <div className="info-grid">
              <div className="info-item" style={{gridColumn: '1 / -1'}}>
                <label>Full Address</label>
                <p>{submission.address || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>City</label>
                <p>{submission.city || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>State</label>
                <p>{submission.state || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Pincode</label>
                <p>{submission.pincode || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="details-section">
            <h2>Emergency Contact</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Contact Name</label>
                <p>{submission.emergencyContactName || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Contact Phone</label>
                <p>{submission.emergencyContactPhone || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Relation</label>
                <p>{submission.emergencyContactRelation || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="details-section">
            <h2>Bank Details</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Account Number</label>
                <p>{submission.bankAccountNumber || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Bank Name</label>
                <p>{submission.bankName || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>IFSC Code</label>
                <p>{submission.bankIFSC || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Self Description */}
          {submission.selfDescription && (
            <div className="details-section">
              <h2>Self Description</h2>
              <p className="about-text">{submission.selfDescription}</p>
            </div>
          )}

          {/* About Me */}
          {submission.aboutMe && (
            <div className="details-section">
              <h2>About Me</h2>
              <p className="about-text">{submission.aboutMe}</p>
            </div>
          )}

          {/* Educational Information */}
          <div className="details-section">
            <h2>Educational Scores</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>10th Percentage</label>
                <p>{submission.tenthPercentage ? `${submission.tenthPercentage}%` : 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>12th/Intermediate Percentage</label>
                <p>{submission.twelthPercentage ? `${submission.twelthPercentage}%` : 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Degree/BTech Percentage</label>
                <p>{submission.degreePercentage ? `${submission.degreePercentage}%` : 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Aadhaar Number</label>
                <p>{submission.aadhaarNumber || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>PAN Number</label>
                <p>{submission.panNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Educational Documents */}
          <div className="details-section">
            <h2>Educational Certificates</h2>
            <div className="documents-grid">
              {submission.tenthCertificate && (
                <div className="document-item">
                  <label>10th Certificate</label>
                  <a href={`${BACKEND_URL}/uploads/${submission.tenthCertificate}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    <FiDownload /> View Document
                  </a>
                </div>
              )}
              {submission.intermediateCertificate && (
                <div className="document-item">
                  <label>Intermediate Certificate</label>
                  <a href={`${BACKEND_URL}/uploads/${submission.intermediateCertificate}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    <FiDownload /> View Document
                  </a>
                </div>
              )}
              {submission.degreeCertificate && (
                <div className="document-item">
                  <label>Degree Certificate</label>
                  <a href={`${BACKEND_URL}/uploads/${submission.degreeCertificate}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    <FiDownload /> View Document
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* BTech Semester Certificates */}
          {(submission.semester1_1 || submission.semester1_2 || submission.semester2_1 || submission.semester2_2 || 
            submission.semester3_1 || submission.semester3_2 || submission.semester4_1 || submission.semester4_2 || 
            submission.provisionalCertificate) && (
            <div className="details-section">
              <h2>BTech Semester Certificates</h2>
              <div className="documents-grid">
                {submission.semester1_1 && (
                  <div className="document-item">
                    <label>Semester 1-1</label>
                    <a href={`${BACKEND_URL}/uploads/${submission.semester1_1}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      <FiDownload /> View Document
                    </a>
                  </div>
                )}
                {submission.semester1_2 && (
                  <div className="document-item">
                    <label>Semester 1-2</label>
                    <a href={`${BACKEND_URL}/uploads/${submission.semester1_2}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      <FiDownload /> View Document
                    </a>
                  </div>
                )}
                {submission.semester2_1 && (
                  <div className="document-item">
                    <label>Semester 2-1</label>
                    <a href={`${BACKEND_URL}/uploads/${submission.semester2_1}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      <FiDownload /> View Document
                    </a>
                  </div>
                )}
                {submission.semester2_2 && (
                  <div className="document-item">
                    <label>Semester 2-2</label>
                    <a href={`${BACKEND_URL}/uploads/${submission.semester2_2}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      <FiDownload /> View Document
                    </a>
                  </div>
                )}
                {submission.semester3_1 && (
                  <div className="document-item">
                    <label>Semester 3-1</label>
                    <a href={`${BACKEND_URL}/uploads/${submission.semester3_1}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      <FiDownload /> View Document
                    </a>
                  </div>
                )}
                {submission.semester3_2 && (
                  <div className="document-item">
                    <label>Semester 3-2</label>
                    <a href={`${BACKEND_URL}/uploads/${submission.semester3_2}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      <FiDownload /> View Document
                    </a>
                  </div>
                )}
                {submission.semester4_1 && (
                  <div className="document-item">
                    <label>Semester 4-1</label>
                    <a href={`${BACKEND_URL}/uploads/${submission.semester4_1}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      <FiDownload /> View Document
                    </a>
                  </div>
                )}
                {submission.semester4_2 && (
                  <div className="document-item">
                    <label>Semester 4-2</label>
                    <a href={`${BACKEND_URL}/uploads/${submission.semester4_2}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      <FiDownload /> View Document
                    </a>
                  </div>
                )}
                {submission.provisionalCertificate && (
                  <div className="document-item">
                    <label>Provisional Certificate</label>
                    <a href={`${BACKEND_URL}/uploads/${submission.provisionalCertificate}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                      <FiDownload /> View Document
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Experience */}
          {submission.totalExperience > 0 && (
            <div className="details-section">
              <h2>Work Experience</h2>
              {submission.previousCompanies && submission.previousCompanies.length > 0 && (
                <div className="experience-list">
                  {submission.previousCompanies.map((company, index) => (
                    <div key={index} className="experience-item">
                      <h4>{company.designation}</h4>
                      <p>{company.companyName}</p>
                      <span>{company.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Identity Documents */}
          <div className="details-section">
            <h2>Identity Documents</h2>
            <div className="documents-grid">
              <div className="document-item">
                <label>Aadhaar Card</label>
                <a href={`${BACKEND_URL}/uploads/${submission.aadhaarDocument}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  <FiDownload /> View Document
                </a>
              </div>
              <div className="document-item">
                <label>PAN Card</label>
                <a href={`${BACKEND_URL}/uploads/${submission.panDocument}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  <FiDownload /> View Document
                </a>
              </div>
              <div className="document-item">
                <label>Address Proof</label>
                <a href={`${BACKEND_URL}/uploads/${submission.addressProof}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  <FiDownload /> View Document
                </a>
              </div>
            </div>
          </div>

          {/* HR Remarks */}
          {submission.hrRemarks && (
            <div className="details-section remarks-section">
              <h2>HR Remarks</h2>
              <p>{submission.hrRemarks}</p>
            </div>
          )}

          {/* Actions */}
          {submission.status === 'SUBMITTED' && (
            <div className="details-section">
              <h2>Review Submission</h2>
              <div className="form-group">
                <label className="form-label">Remarks (Optional)</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Add your remarks here..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
              <div className="action-buttons">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="btn btn-danger"
                  disabled={actionLoading}
                >
                  <FiX /> Reject
                </button>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="btn btn-success"
                  disabled={actionLoading}
                >
                  <FiCheck /> Send Onboarding Pass
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal-overlay" onClick={() => setShowApproveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Send Onboarding Pass</h2>
            <p>Please specify the Date of Joining for the employee:</p>
            <div className="form-group">
              <label>Date of Joining *</label>
              <input
                type="date"
                className="form-control"
                value={dateOfJoining}
                onChange={(e) => setDateOfJoining(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label>Remarks (Optional)</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Any additional remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowApproveModal(false)}
                className="btn btn-secondary"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="btn btn-success"
                disabled={actionLoading || !dateOfJoining}
              >
                {actionLoading ? (
                  <>
                    <div className="spinner spinner-small"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiCheck /> Send Onboarding Pass
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reject Submission</h2>
            <p>Please provide a reason for rejection:</p>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Rejection remarks (required)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              required
            />
            <div className="modal-actions">
              <button
                onClick={() => setShowRejectModal(false)}
                className="btn btn-secondary"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="btn btn-danger"
                disabled={actionLoading || !remarks.trim()}
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionDetails;

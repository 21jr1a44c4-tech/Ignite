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

  const downloadDocument = (documentObj, docName) => {
    if (!documentObj || !documentObj.data) {
      toast.error('Document not found');
      return;
    }

    try {
      let blobData;
      
      // Handle different data formats from MongoDB
      if (typeof documentObj.data === 'string') {
        // If it's a string, it should be base64 encoded
        try {
          // Clean up the base64 string (remove any whitespace)
          const cleanBase64 = documentObj.data.replace(/\s/g, '');
          
          // Try to decode base64
          const binaryString = atob(cleanBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          blobData = new Blob([bytes], { type: documentObj.contentType || 'application/octet-stream' });
          console.log('Successfully decoded base64 string');
        } catch (e) {
          console.error('Base64 decode error:', e);
          toast.error('Error decoding document data');
          return;
        }
      } else if (documentObj.data instanceof ArrayBuffer) {
        // Handle ArrayBuffer
        blobData = new Blob([documentObj.data], { type: documentObj.contentType || 'application/octet-stream' });
      } else if (Array.isArray(documentObj.data)) {
        // Handle array of bytes (MongoDB serializes Buffer as array)
        const uint8Array = new Uint8Array(documentObj.data);
        blobData = new Blob([uint8Array], { type: documentObj.contentType || 'application/octet-stream' });
        console.log('Converted array to blob');
      } else if (documentObj.data instanceof Blob) {
        // Already a blob
        blobData = documentObj.data;
      } else {
        // Try to handle as generic object
        console.warn('Unknown data format:', typeof documentObj.data, documentObj.data);
        blobData = new Blob([JSON.stringify(documentObj.data)], { type: documentObj.contentType || 'application/octet-stream' });
      }

      // Create download link
      const url = window.URL.createObjectURL(blobData);
      const link = document.createElement('a');
      link.href = url;
      link.download = documentObj.filename || `${docName}`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
      
      toast.success('Document downloaded successfully');
    } catch (error) {
      toast.error('Error downloading document');
      console.error('Download error:', error);
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
              {submission.profilePhoto?.data && (
                <div className="profile-photo-container">
                  <img
                    src={`data:${submission.profilePhoto.contentType};base64,${submission.profilePhoto.data}`}
                    alt={submission.fullName}
                    className="profile-photo"
                  />
                </div>
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
              {submission.tenthCertificate?.data && (
                <div className="document-item">
                  <label>10th Certificate</label>
                  <button 
                    onClick={() => downloadDocument(submission.tenthCertificate, '10th-certificate')}
                    className="btn btn-secondary btn-sm">
                    <FiDownload /> {submission.tenthCertificate?.filename || 'View Document'}
                  </button>
                </div>
              )}
              {submission.intermediateCertificate?.data && (
                <div className="document-item">
                  <label>Intermediate Certificate</label>
                  <button 
                    onClick={() => downloadDocument(submission.intermediateCertificate, 'intermediate-certificate')}
                    className="btn btn-secondary btn-sm">
                    <FiDownload /> {submission.intermediateCertificate?.filename || 'View Document'}
                  </button>
                </div>
              )}
              {submission.degreeCertificate?.data && (
                <div className="document-item">
                  <label>Degree Certificate</label>
                  <button 
                    onClick={() => downloadDocument(submission.degreeCertificate, 'degree-certificate')}
                    className="btn btn-secondary btn-sm">
                    <FiDownload /> {submission.degreeCertificate?.filename || 'View Document'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* BTech Semester Certificates */}
          {(submission.semester1_1?.data || submission.semester1_2?.data || submission.semester2_1?.data || submission.semester2_2?.data || 
            submission.semester3_1?.data || submission.semester3_2?.data || submission.semester4_1?.data || submission.semester4_2?.data || 
            submission.provisionalCertificate?.data) && (
            <div className="details-section">
              <h2>BTech Semester Certificates</h2>
              <div className="documents-grid">
                {submission.semester1_1?.data && (
                  <div className="document-item">
                    <label>Semester 1-1</label>
                    <button 
                      onClick={() => downloadDocument(submission.semester1_1, 'semester-1-1')}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {submission.semester1_1?.filename || 'View Document'}
                    </button>
                  </div>
                )}
                {submission.semester1_2?.data && (
                  <div className="document-item">
                    <label>Semester 1-2</label>
                    <button 
                      onClick={() => downloadDocument(submission.semester1_2, 'semester-1-2')}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {submission.semester1_2?.filename || 'View Document'}
                    </button>
                  </div>
                )}
                {submission.semester2_1?.data && (
                  <div className="document-item">
                    <label>Semester 2-1</label>
                    <button 
                      onClick={() => downloadDocument(submission.semester2_1, 'semester-2-1')}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {submission.semester2_1?.filename || 'View Document'}
                    </button>
                  </div>
                )}
                {submission.semester2_2?.data && (
                  <div className="document-item">
                    <label>Semester 2-2</label>
                    <button 
                      onClick={() => downloadDocument(submission.semester2_2, 'semester-2-2')}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {submission.semester2_2?.filename || 'View Document'}
                    </button>
                  </div>
                )}
                {submission.semester3_1?.data && (
                  <div className="document-item">
                    <label>Semester 3-1</label>
                    <button 
                      onClick={() => downloadDocument(submission.semester3_1, 'semester-3-1')}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {submission.semester3_1?.filename || 'View Document'}
                    </button>
                  </div>
                )}
                {submission.semester3_2?.data && (
                  <div className="document-item">
                    <label>Semester 3-2</label>
                    <button 
                      onClick={() => downloadDocument(submission.semester3_2, 'semester-3-2')}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {submission.semester3_2?.filename || 'View Document'}
                    </button>
                  </div>
                )}
                {submission.semester4_1?.data && (
                  <div className="document-item">
                    <label>Semester 4-1</label>
                    <button 
                      onClick={() => downloadDocument(submission.semester4_1, 'semester-4-1')}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {submission.semester4_1?.filename || 'View Document'}
                    </button>
                  </div>
                )}
                {submission.semester4_2?.data && (
                  <div className="document-item">
                    <label>Semester 4-2</label>
                    <button 
                      onClick={() => downloadDocument(submission.semester4_2, 'semester-4-2')}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {submission.semester4_2?.filename || 'View Document'}
                    </button>
                  </div>
                )}
                {submission.provisionalCertificate?.data && (
                  <div className="document-item">
                    <label>Provisional Certificate</label>
                    <button 
                      onClick={() => downloadDocument(submission.provisionalCertificate, 'provisional-certificate')}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {submission.provisionalCertificate?.filename || 'View Document'}
                    </button>
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
              {submission.aadhaarDocument?.data && (
                <div className="document-item">
                  <label>Aadhaar Card</label>
                  <button 
                    onClick={() => downloadDocument(submission.aadhaarDocument, 'aadhaar')}
                    className="btn btn-secondary btn-sm">
                    <FiDownload /> {submission.aadhaarDocument?.filename || 'View Document'}
                  </button>
                </div>
              )}
              {submission.panDocument?.data && (
                <div className="document-item">
                  <label>PAN Card</label>
                  <button 
                    onClick={() => downloadDocument(submission.panDocument, 'pan')}
                    className="btn btn-secondary btn-sm">
                    <FiDownload /> {submission.panDocument?.filename || 'View Document'}
                  </button>
                </div>
              )}
              {submission.addressProof?.data && (
                <div className="document-item">
                  <label>Address Proof</label>
                  <button 
                    onClick={() => downloadDocument(submission.addressProof, 'address-proof')}
                    className="btn btn-secondary btn-sm">
                    <FiDownload /> {submission.addressProof?.filename || 'View Document'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Certificates */}
          {submission.additionalCertificates && submission.additionalCertificates.some(cert => cert?.data) && (
            <div className="details-section">
              <h2>Additional Certificates</h2>
              <div className="documents-grid">
                {submission.additionalCertificates.map((cert, index) => cert?.data && (
                  <div key={index} className="document-item">
                    <label>Additional Certificate {index + 1}</label>
                    <button 
                      onClick={() => downloadDocument(cert, `additional-certificate-${index + 1}`)}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {cert?.filename || 'View Document'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Letters */}
          {submission.experienceLetters && submission.experienceLetters.some(letter => letter?.data) && (
            <div className="details-section">
              <h2>Experience Letters</h2>
              <div className="documents-grid">
                {submission.experienceLetters.map((letter, index) => letter?.data && (
                  <div key={index} className="document-item">
                    <label>Experience Letter {index + 1}</label>
                    <button 
                      onClick={() => downloadDocument(letter, `experience-letter-${index + 1}`)}
                      className="btn btn-secondary btn-sm">
                      <FiDownload /> {letter?.filename || 'View Document'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Photo Download Section */}
          {submission.profilePhoto?.data && (
            <div className="details-section">
              <h2>Download Profile Photo</h2>
              <div className="documents-grid">
                <div className="document-item">
                  <label>Profile Photo</label>
                  <button 
                    onClick={() => downloadDocument(submission.profilePhoto, 'profile-photo')}
                    className="btn btn-secondary btn-sm">
                    <FiDownload /> {submission.profilePhoto?.filename || 'View Document'}
                  </button>
                </div>
              </div>
            </div>
          )}

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

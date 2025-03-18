import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AgencyVerificationForm = () => {
    const { authData } = useAuth();
    const [formData, setFormData] = useState({
        agencyId: authData?.user?.id || '',
        nrc: '',
        nrcPhotoFront: null,
        nrcPhotoBack: null,
        agencyLicenseFront: null,
        agencyLicenseBack: null
    });
    const [verification, setVerification] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchVerification = async () => {
            if (!authData?.user?.id) {
                setError('No agency ID available. Please log in.');
                return;
            }
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/agency/verification/${authData.user.id}`);
                setVerification(response.data);
                setIsVerified(response.data?.verificationStatus === 'VERIFIED');
                setFormData(prev => ({
                    ...prev,
                    nrc: response.data?.nrc || '', // Pre-fill NRC if available
                }));
            } catch (error) {
                console.error('Error fetching verification:', error);
                setError(error.response?.data?.message || 'Failed to load verification status');
            } finally {
                setLoading(false);
            }
        };
        fetchVerification();
    }, [authData?.user?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [field]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isVerified) {
            setError('Cannot modify verified verification data.');
            return;
        }
        if (!formData.nrc || !formData.nrcPhotoFront || !formData.nrcPhotoBack || 
            !formData.agencyLicenseFront || !formData.agencyLicenseBack) {
            setError('Please fill in all required fields');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const formDataToSend = new FormData();
            const agencyId = Number(authData?.user?.id);
            if (isNaN(agencyId)) {
                throw new Error('Invalid agency ID');
            }
            formDataToSend.append('agencyId', agencyId);
            formDataToSend.append('nrc', formData.nrc);
            formDataToSend.append('nrcPhotoFront', formData.nrcPhotoFront);
            formDataToSend.append('nrcPhotoBack', formData.nrcPhotoBack);
            formDataToSend.append('agencyLicenseFront', formData.agencyLicenseFront);
            formDataToSend.append('agencyLicenseBack', formData.agencyLicenseBack);

            console.log('Sending payload:', {
                agencyId,
                nrc: formData.nrc,
                nrcPhotoFront: formData.nrcPhotoFront?.name,
                nrcPhotoBack: formData.nrcPhotoBack?.name,
                agencyLicenseFront: formData.agencyLicenseFront?.name,
                agencyLicenseBack: formData.agencyLicenseBack?.name,
            });

            const response = await axiosInstance.post('/agency/verification/upload', formDataToSend);
            setVerification(response.data.data); // Assuming response has 'data' field
            setIsVerified(response.data.data?.verificationStatus === 'VERIFIED');
            setSuccess(response.data.message); // Display success message
            setFormData(prev => ({ // Reset file inputs
                ...prev,
                nrcPhotoFront: null,
                nrcPhotoBack: null,
                agencyLicenseFront: null,
                agencyLicenseBack: null
            }));
            // Reset file input elements
            document.getElementById('nrcPhotoFront').value = null;
            document.getElementById('nrcPhotoBack').value = null;
            document.getElementById('agencyLicenseFront').value = null;
            document.getElementById('agencyLicenseBack').value = null;
        } catch (error) {
            console.error('Error updating verification:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update verification';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agency-verification-form">
            <h2>Agency Verification</h2>
            {loading && <p className="alert alert-info">Loading...</p>}
            {error && <p className="alert alert-danger">{error}</p>}
            {success && <p className="alert alert-success">{success}</p>}
            {isVerified && (
                <p className="alert alert-warning">Verification is already verified. Cannot modify data.</p>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nrc">NRC Number:</label>
                    <input
                        id="nrc"
                        type="text"
                        name="nrc"
                        value={formData.nrc}
                        onChange={handleChange}
                        required
                        disabled={isVerified || loading}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nrcPhotoFront">NRC Photo Front:</label>
                    <input
                        id="nrcPhotoFront"
                        type="file"
                        name="nrcPhotoFront"
                        onChange={(e) => handleFileChange(e, 'nrcPhotoFront')}
                        required={!verification} // Required only if no verification exists
                        disabled={isVerified || loading}
                        className="form-control"
                        accept="image/*"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nrcPhotoBack">NRC Photo Back:</label>
                    <input
                        id="nrcPhotoBack"
                        type="file"
                        name="nrcPhotoBack"
                        onChange={(e) => handleFileChange(e, 'nrcPhotoBack')}
                        required={!verification}
                        disabled={isVerified || loading}
                        className="form-control"
                        accept="image/*"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="agencyLicenseFront">Agency License Front:</label>
                    <input
                        id="agencyLicenseFront"
                        type="file"
                        name="agencyLicenseFront"
                        onChange={(e) => handleFileChange(e, 'agencyLicenseFront')}
                        required={!verification}
                        disabled={isVerified || loading}
                        className="form-control"
                        accept="image/*"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="agencyLicenseBack">Agency License Back:</label>
                    <input
                        id="agencyLicenseBack"
                        type="file"
                        name="agencyLicenseBack"
                        onChange={(e) => handleFileChange(e, 'agencyLicenseBack')}
                        required={!verification}
                        disabled={isVerified || loading}
                        className="form-control"
                        accept="image/*"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isVerified || loading}
                    className="btn btn-primary"
                >
                    {loading ? 'Uploading...' : 'Upload/Update Verification'}
                </button>
            </form>
        </div>
    );
};

export default AgencyVerificationForm;
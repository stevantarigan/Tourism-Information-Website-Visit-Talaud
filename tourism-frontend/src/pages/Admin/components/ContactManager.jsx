// pages/Admin/components/ContactManager.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import contactService from '../../../services/contactService';
import './ContactManager.css';

// ===== Konfigurasi SweetAlert2 =====
const swalConfig = {
    customClass: {
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        htmlContainer: 'swal-custom-html',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
    },
    buttonsStyling: false,
    reverseButtons: true,
};

const showSuccess = (title, text) =>
    Swal.fire({ ...swalConfig, icon: 'success', title, text, timer: 2200, timerProgressBar: true, showConfirmButton: false });

const showError = (title, text) =>
    Swal.fire({ ...swalConfig, icon: 'error', title, text, confirmButtonText: 'Tutup' });

// ===== Icon Components =====
const Icons = {
    Save: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    ),
    Edit: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    Phone: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    ),
    Email: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    ),
    Address: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Facebook: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    Instagram: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" />
        </svg>
    ),
    Youtube: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    Tiktok: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.01 2.61-.01 3.91-.02.06 1.56.66 3.07 1.69 4.19 1.03 1.12 2.43 1.83 4.03 1.97v3.38c-1.39-.15-2.74-.62-3.92-1.34-.08 2.31-.41 4.6-1.34 6.73-.93 2.13-2.4 3.96-4.28 5.15-1.88 1.19-4.11 1.77-6.41 1.67-2.17-.09-4.25-.8-5.91-2.02.48.49.1 1.16-.86 1.16-.94 0-1.74-.75-1.74-1.68v-1.45c.26.06.53.09.8.09 1.85 0 3.52-.66 4.81-1.76 1.28-1.1 2.03-2.62 2.14-4.24.11-1.62-.41-3.21-1.49-4.47-.3-.35-.06-.86.4-.86h2.09c.34 0 .62.24.69.57.19.93.61 1.79 1.22 2.49.61.7 1.41 1.21 2.29 1.46.03-1.26.06-2.52.09-3.78.05-1.45.55-2.84 1.42-3.94.87-1.1 2.1-1.82 3.44-2.03z" />
        </svg>
    ),
    Contact: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
    )
};

const ContactManager = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        address: '',
        facebook: '',
        instagram: '',
        youtube: '',
        tiktok: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const data = await contactService.getAll();
            let contactData = null;
            if (Array.isArray(data) && data.length > 0) {
                contactData = data[0];
            } else if (data && typeof data === 'object' && data.phone) {
                contactData = data;
            }
            setContacts(contactData ? [contactData] : []);
            if (contactData) {
                setFormData({
                    phone: contactData.phone || '',
                    email: contactData.email || '',
                    address: contactData.address || '',
                    facebook: contactData.facebook || '',
                    instagram: contactData.instagram || '',
                    youtube: contactData.youtube || '',
                    tiktok: contactData.tiktok || ''
                });
            }
        } catch (error) {
            console.error('❌ Error fetching contacts:', error);
            showError('Gagal Memuat Data', error.response?.data?.message || 'Terjadi kesalahan saat memuat kontak.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = {
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                address: formData.address.trim(),
                facebook: formData.facebook.trim(),
                instagram: formData.instagram.trim(),
                youtube: formData.youtube.trim(),
                tiktok: formData.tiktok.trim()
            };

            const existingContact = contacts.length > 0 ? contacts[0] : null;

            if (existingContact) {
                await contactService.update(existingContact.id, submitData);
                showSuccess('Berhasil!', 'Kontak berhasil diperbarui.');
            } else {
                await contactService.create(submitData);
                showSuccess('Berhasil!', 'Kontak baru berhasil ditambahkan.');
            }

            await fetchContacts();
            setIsEditing(false);
        } catch (error) {
            console.error('❌ Error saving contact:', error);
            let msg = 'Gagal menyimpan kontak.';
            if (error.response?.data?.errors) {
                msg = Object.values(error.response.data.errors).flat().join(', ');
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            }
            showError('Gagal Menyimpan', msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        const contact = contacts.length > 0 ? contacts[0] : null;
        if (contact) {
            setFormData({
                phone: contact.phone || '',
                email: contact.email || '',
                address: contact.address || '',
                facebook: contact.facebook || '',
                instagram: contact.instagram || '',
                youtube: contact.youtube || '',
                tiktok: contact.tiktok || ''
            });
        }
        document.querySelector('.contact-manager-container')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditing(false);
        const contact = contacts.length > 0 ? contacts[0] : null;
        if (contact) {
            setFormData({
                phone: contact.phone || '',
                email: contact.email || '',
                address: contact.address || '',
                facebook: contact.facebook || '',
                instagram: contact.instagram || '',
                youtube: contact.youtube || '',
                tiktok: contact.tiktok || ''
            });
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
                <p>Memuat data kontak...</p>
            </div>
        );
    }

    const contact = contacts.length > 0 ? contacts[0] : null;

    return (
        <div className="admin-page">
            <div className="contact-manager-header">
                <h2>
                    <Icons.Contact /> Manajemen Kontak
                    <span> — Atur informasi kontak website</span>
                </h2>
                {!isEditing && contact && (
                    <button className="btn-edit-contact" onClick={handleEdit}>
                        <Icons.Edit /> Edit Kontak
                    </button>
                )}
            </div>

            <div className="contact-preview-card">
                <h3>Preview Kontak</h3>
                <div className="contact-preview">
                    <div className="preview-grid">
                        {contact?.phone && (
                            <div className="preview-item">
                                <span className="preview-icon"><Icons.Phone /></span>
                                <div>
                                    <label>Telepon</label>
                                    <p>{contact.phone}</p>
                                </div>
                            </div>
                        )}
                        {contact?.email && (
                            <div className="preview-item">
                                <span className="preview-icon"><Icons.Email /></span>
                                <div>
                                    <label>Email</label>
                                    <p>{contact.email}</p>
                                </div>
                            </div>
                        )}
                        {contact?.address && (
                            <div className="preview-item">
                                <span className="preview-icon"><Icons.Address /></span>
                                <div>
                                    <label>Alamat</label>
                                    <p>{contact.address}</p>
                                </div>
                            </div>
                        )}
                        <div className="preview-item preview-social">
                            <span className="preview-icon">🌐</span>
                            <div>
                                <label>Sosial Media</label>
                                <div className="preview-social-links">
                                    {contact?.facebook && (
                                        <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="social-link-preview facebook">
                                            <Icons.Facebook />
                                        </a>
                                    )}
                                    {contact?.instagram && (
                                        <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="social-link-preview instagram">
                                            <Icons.Instagram />
                                        </a>
                                    )}
                                    {contact?.youtube && (
                                        <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="social-link-preview youtube">
                                            <Icons.Youtube />
                                        </a>
                                    )}
                                    {contact?.tiktok && (
                                        <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" className="social-link-preview tiktok">
                                            <Icons.Tiktok />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="contact-manager-container">
                <div className="contact-manager-title">
                    <span className="form-icon">
                        {isEditing ? <Icons.Edit /> : <Icons.Contact />}
                    </span>
                    {isEditing ? 'Edit Kontak' : 'Detail Kontak'}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="contact-manager-form">
                        <div className="form-group">
                            <label htmlFor="phone"><Icons.Phone /> Telepon</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+62 812-3456-7890"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email"><Icons.Email /> Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="info@example.com"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="address"><Icons.Address /> Alamat</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Masukkan alamat lengkap"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Media Sosial</label>
                            <div className="social-input-grid">
                                <div className="social-input-item facebook-input">
                                    <label htmlFor="facebook"><Icons.Facebook /> Facebook</label>
                                    <input
                                        type="text"
                                        id="facebook"
                                        name="facebook"
                                        value={formData.facebook}
                                        onChange={handleInputChange}
                                        placeholder="https://facebook.com/..."
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="social-input-item instagram-input">
                                    <label htmlFor="instagram"><Icons.Instagram /> Instagram</label>
                                    <input
                                        type="text"
                                        id="instagram"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleInputChange}
                                        placeholder="https://instagram.com/..."
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="social-input-item youtube-input">
                                    <label htmlFor="youtube"><Icons.Youtube /> YouTube</label>
                                    <input
                                        type="text"
                                        id="youtube"
                                        name="youtube"
                                        value={formData.youtube}
                                        onChange={handleInputChange}
                                        placeholder="https://youtube.com/..."
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="social-input-item tiktok-input">
                                    <label htmlFor="tiktok"><Icons.Tiktok /> TikTok</label>
                                    <input
                                        type="text"
                                        id="tiktok"
                                        name="tiktok"
                                        value={formData.tiktok}
                                        onChange={handleInputChange}
                                        placeholder="https://tiktok.com/@..."
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-cancel" onClick={handleCancel} disabled={isSubmitting}>
                                Batal
                            </button>
                            <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><span className="spinner" /> Menyimpan...</>
                                ) : (
                                    <><Icons.Save /> Simpan Perubahan</>
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="contact-detail-view">
                        <div className="detail-item">
                            <label><Icons.Phone /> Telepon</label>
                            <p>{contact?.phone || '-'}</p>
                        </div>
                        <div className="detail-item">
                            <label><Icons.Email /> Email</label>
                            <p>{contact?.email || '-'}</p>
                        </div>
                        <div className="detail-item full-width">
                            <label><Icons.Address /> Alamat</label>
                            <p>{contact?.address || '-'}</p>
                        </div>
                        <div className="detail-item full-width">
                            <label>🌐 Media Sosial</label>
                            <div className="detail-social-links">
                                {contact?.facebook && (
                                    <a href={contact.facebook} target="_blank" rel="noopener noreferrer" className="detail-social-link facebook">
                                        <Icons.Facebook /> Facebook
                                    </a>
                                )}
                                {contact?.instagram && (
                                    <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="detail-social-link instagram">
                                        <Icons.Instagram /> Instagram
                                    </a>
                                )}
                                {contact?.youtube && (
                                    <a href={contact.youtube} target="_blank" rel="noopener noreferrer" className="detail-social-link youtube">
                                        <Icons.Youtube /> YouTube
                                    </a>
                                )}
                                {contact?.tiktok && (
                                    <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" className="detail-social-link tiktok">
                                        <Icons.Tiktok /> TikTok
                                    </a>
                                )}
                                {!contact?.facebook && !contact?.instagram && !contact?.youtube && !contact?.tiktok && (
                                    <span className="no-social">-</span>
                                )}
                            </div>
                        </div>
                        {!contact && (
                            <div className="detail-empty">
                                <p>Belum ada data kontak. Klik tombol Edit untuk menambahkan.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactManager;
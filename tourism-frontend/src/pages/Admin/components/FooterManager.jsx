// pages/Admin/components/FooterManager.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import footerSettingService from '../../../services/footerSettingService';
import './FooterManager.css';

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
    Website: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
    Description: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    ),
    Copyright: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M10 9a3 3 0 0 1 4 0" />
            <path d="M10 15a3 3 0 0 0 4 0" />
        </svg>
    ),
    Footer: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
    )
};

const FooterManager = () => {
    const [footer, setFooter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        website_name: '',
        description: '',
        copyright: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchFooter();
    }, []);

    const fetchFooter = async () => {
        setLoading(true);
        try {
            const data = await footerSettingService.getAll();
            let footerData = null;
            if (Array.isArray(data) && data.length > 0) {
                footerData = data[0];
            } else if (data && typeof data === 'object' && data.website_name) {
                footerData = data;
            }
            setFooter(footerData);
            if (footerData) {
                setFormData({
                    website_name: footerData.website_name || '',
                    description: footerData.description || '',
                    copyright: footerData.copyright || ''
                });
            }
        } catch (error) {
            console.error('❌ Error fetching footer:', error);
            showError('Gagal Memuat Data', error.response?.data?.message || 'Terjadi kesalahan saat memuat footer.');
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
                website_name: formData.website_name.trim(),
                description: formData.description.trim(),
                copyright: formData.copyright.trim()
            };

            if (footer) {
                await footerSettingService.update(footer.id, submitData);
                showSuccess('Berhasil!', 'Footer berhasil diperbarui.');
            } else {
                await footerSettingService.create(submitData);
                showSuccess('Berhasil!', 'Footer baru berhasil ditambahkan.');
            }

            await fetchFooter();
            setIsEditing(false);
        } catch (error) {
            console.error('❌ Error saving footer:', error);
            let msg = 'Gagal menyimpan footer.';
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
        if (footer) {
            setFormData({
                website_name: footer.website_name || '',
                description: footer.description || '',
                copyright: footer.copyright || ''
            });
        }
        document.querySelector('.footer-manager-container')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (footer) {
            setFormData({
                website_name: footer.website_name || '',
                description: footer.description || '',
                copyright: footer.copyright || ''
            });
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
                <p>Memuat data footer...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="footer-manager-header">
                <h2>
                    <Icons.Footer /> Pengaturan Footer
                    <span> — Atur konten footer website</span>
                </h2>
                {!isEditing && footer && (
                    <button className="btn-edit-footer" onClick={handleEdit}>
                        <Icons.Edit /> Edit Footer
                    </button>
                )}
            </div>

            <div className="footer-preview-card">
                <h3>Preview Footer</h3>
                <div className="footer-preview">
                    <div className="preview-content">
                        <div className="preview-brand">
                            <h4>{footer?.website_name || 'Pariwisata Talaud'}</h4>
                            <p>{footer?.description || 'Jelajahi keindahan alam dan budaya Kepulauan Talaud'}</p>
                        </div>
                        <div className="preview-copyright">
                            <p>© {new Date().getFullYear()} {footer?.copyright || `${footer?.website_name || 'Pariwisata Talaud'}. All rights reserved.`}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-manager-container">
                <div className="footer-manager-title">
                    <span className="form-icon">
                        {isEditing ? <Icons.Edit /> : <Icons.Footer />}
                    </span>
                    {isEditing ? 'Edit Footer' : 'Detail Footer'}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="footer-manager-form">
                        <div className="form-group full-width">
                            <label htmlFor="website_name">
                                <Icons.Website /> Nama Website <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="website_name"
                                name="website_name"
                                value={formData.website_name}
                                onChange={handleInputChange}
                                required
                                placeholder="Masukkan nama website"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="description"><Icons.Description /> Deskripsi</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                placeholder="Masukkan deskripsi footer"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="copyright"><Icons.Copyright /> Copyright</label>
                            <input
                                type="text"
                                id="copyright"
                                name="copyright"
                                value={formData.copyright}
                                onChange={handleInputChange}
                                placeholder="© 2024 Nama Website. All Rights Reserved."
                                disabled={isSubmitting}
                            />
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
                    <div className="footer-detail-view">
                        <div className="detail-item">
                            <label>Nama Website</label>
                            <p>{footer?.website_name || '-'}</p>
                        </div>
                        <div className="detail-item">
                            <label>Deskripsi</label>
                            <p>{footer?.description || '-'}</p>
                        </div>
                        <div className="detail-item">
                            <label>Copyright</label>
                            <p>{footer?.copyright || '-'}</p>
                        </div>
                        {!footer && (
                            <div className="detail-empty">
                                <p>Belum ada data footer. Klik tombol Edit untuk menambahkan.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FooterManager;
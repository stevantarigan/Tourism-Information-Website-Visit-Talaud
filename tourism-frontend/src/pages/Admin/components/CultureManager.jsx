// pages/Admin/components/CultureManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import cultureService from '../../../services/cultureService';
import getImageUrl from '../../../utils/imageHelper';
import './CultureManager.css';

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

const showConfirmDelete = (title) =>
    Swal.fire({
        ...swalConfig,
        icon: 'warning',
        title: 'Hapus Budaya?',
        html: `Anda akan menghapus budaya <b>"${title}"</b>.<br/>Tindakan ini tidak dapat dibatalkan.`,
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        focusCancel: true,
        customClass: {
            ...swalConfig.customClass,
            confirmButton: 'swal-custom-confirm swal-confirm-danger',
        },
    });

// ===== Icon Components =====
const Icons = {
    Plus: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    ),
    Edit: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    Delete: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    ),
    Upload: () => (
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    ),
    Close: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    ),
    Culture: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Location: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Calendar: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    )
};

const CultureManager = () => {
    const [cultures, setCultures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        location: '',
        event_date: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchCultures();
    }, []);

    const fetchCultures = async () => {
        setLoading(true);
        try {
            const data = await cultureService.getAll();
            console.log('📦 Cultures data:', data);
            setCultures(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('❌ Error fetching cultures:', error);
            showError('Gagal Memuat Data', error.response?.data?.message || 'Terjadi kesalahan saat memuat budaya.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                showError('Format Tidak Didukung', 'Gunakan JPG, PNG, GIF, atau WEBP.');
                e.target.value = '';
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                showError('File Terlalu Besar', 'Ukuran maksimal 2MB.');
                e.target.value = '';
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData(prev => ({ ...prev, image: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('description', formData.description.trim());
            if (formData.location) formDataToSend.append('location', formData.location.trim());
            if (formData.event_date) formDataToSend.append('event_date', formData.event_date);
            if (imageFile) formDataToSend.append('image', imageFile);
            if (editing) formDataToSend.append('_method', 'PUT');

            if (editing) {
                await cultureService.update(editing, formDataToSend);
                showSuccess('Berhasil!', 'Budaya berhasil diperbarui.');
            } else {
                await cultureService.create(formDataToSend);
                showSuccess('Berhasil!', 'Budaya baru berhasil ditambahkan.');
            }

            resetForm();
            await fetchCultures();
        } catch (error) {
            console.error('❌ Error saving culture:', error);
            let msg = 'Gagal menyimpan budaya.';
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

    const handleEdit = (item) => {
        setEditing(item.id);
        setFormData({
            title: item.title || '',
            description: item.description || '',
            image: item.image || '',
            location: item.location || '',
            event_date: item.event_date || ''
        });
        setImagePreview(getImageUrl(item.image));
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        document.querySelector('.culture-form-container')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (item) => {
        const result = await showConfirmDelete(item.title);
        if (!result.isConfirmed) return;

        Swal.fire({
            ...swalConfig,
            title: 'Menghapus...',
            html: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            await cultureService.delete(item.id);
            await fetchCultures();
            showSuccess('Terhapus!', `Budaya "${item.title}" berhasil dihapus.`);
        } catch (error) {
            console.error('❌ Error deleting culture:', error);
            showError('Gagal Menghapus', error.response?.data?.message || 'Terjadi kesalahan saat menghapus budaya.');
        }
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({
            title: '',
            description: '',
            image: '',
            location: '',
            event_date: ''
        });
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCancel = resetForm;

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
                <p>Memuat data budaya...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="culture-manager-header">
                <h2>
                    <Icons.Culture /> Manajemen Budaya
                    <span> — Kelola informasi budaya</span>
                </h2>
            </div>

            <div className="culture-form-container">
                <div className="culture-form-title">
                    <span className="form-icon">
                        {editing ? <Icons.Edit /> : <Icons.Plus />}
                    </span>
                    {editing ? 'Edit Budaya' : 'Tambah Budaya Baru'}
                </div>

                <form onSubmit={handleSubmit} className="culture-form" encType="multipart/form-data">
                    <div className="form-group full-width">
                        <label htmlFor="title">Judul <span className="required">*</span></label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            placeholder="Masukkan judul budaya"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="description">Deskripsi <span className="required">*</span></label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            required
                            placeholder="Masukkan deskripsi budaya"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="image">
                            Gambar
                            <span className="field-hint">(JPG, PNG, GIF, WEBP • Max 2MB)</span>
                            {editing && !imageFile && (
                                <span className="field-hint" style={{ color: '#D97706' }}>
                                    • Kosongkan jika tidak ingin mengubah gambar
                                </span>
                            )}
                        </label>

                        {imagePreview ? (
                            <div className="image-preview-container">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="preview-image"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100?text=No+Image'; }}
                                />
                                <div className="preview-info">
                                    <div className="file-name">{imageFile ? imageFile.name : 'Gambar saat ini'}</div>
                                    {imageFile && <div className="file-size">{(imageFile.size / 1024).toFixed(1)} KB</div>}
                                    {editing && !imageFile && <div className="file-note">⚠️ Gambar akan tetap sama jika tidak diubah</div>}
                                </div>
                                <button type="button" className="btn-remove-image" onClick={handleRemoveImage} disabled={isSubmitting}>
                                    <Icons.Close /> Hapus
                                </button>
                            </div>
                        ) : (
                            <div
                                className="file-upload-wrapper"
                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragging'); }}
                                onDragLeave={(e) => e.currentTarget.classList.remove('dragging')}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.remove('dragging');
                                    const file = e.dataTransfer.files[0];
                                    if (file) handleFileChange({ target: { files: [file] } });
                                }}
                            >
                                <div className="upload-icon"><Icons.Upload /></div>
                                <div className="upload-text">Klik atau drag & drop untuk upload</div>
                                <div className="upload-subtext">Format: JPG, PNG, GIF, WEBP • Maks: 2MB</div>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="location"><Icons.Location /> Lokasi</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Masukkan lokasi"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="event_date"><Icons.Calendar /> Tanggal Event</label>
                        <input
                            type="date"
                            id="event_date"
                            name="event_date"
                            value={formData.event_date}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-actions">
                        {editing && (
                            <button type="button" className="btn-cancel" onClick={handleCancel} disabled={isSubmitting}>
                                Batal
                            </button>
                        )}
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <><span className="spinner" /> Menyimpan...</>
                            ) : (
                                <>{editing ? <Icons.Edit /> : <Icons.Plus />}{editing ? 'Update Budaya' : 'Tambah Budaya'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-header">
                <h3>Daftar Budaya</h3>
                <span className="table-count">{cultures.length} data</span>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Judul</th>
                            <th>Lokasi</th>
                            <th>Tanggal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cultures.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    <div className="no-data-icon">📭</div>
                                    <div className="no-data-text">Belum ada data budaya</div>
                                    <div className="no-data-subtext">Tambahkan budaya baru menggunakan form di atas</div>
                                </td>
                            </tr>
                        ) : (
                            cultures.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <strong>{item.title}</strong>
                                        {item.image && (
                                            <div style={{ marginTop: '6px' }}>
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.title}
                                                    className="table-image"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td>{item.location || '-'}</td>
                                    <td>
                                        {item.event_date ? (
                                            <span className="badge-date">
                                                <Icons.Calendar /> {new Date(item.event_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-edit" onClick={() => handleEdit(item)} title="Edit">
                                                <Icons.Edit />
                                            </button>
                                            <button className="btn-delete" onClick={() => handleDelete(item)} title="Hapus">
                                                <Icons.Delete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CultureManager;
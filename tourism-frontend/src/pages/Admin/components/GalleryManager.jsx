// pages/Admin/components/GalleryManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import galleryService from '../../../services/galleryService';
import getImageUrl from '../../../utils/imageHelper';
import './GalleryManager.css';

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
        title: 'Hapus Foto?',
        html: `Anda akan menghapus foto <b>"${title}"</b>.<br/>Tindakan ini tidak dapat dibatalkan.`,
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
    Image: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    Grid: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    )
};

const GalleryManager = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ title: '', image: '', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        setLoading(true);
        try {
            const data = await galleryService.getAll();
            setGalleries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('❌ Error fetching galleries:', error);
            showError('Gagal Memuat Data', error.response?.data?.message || 'Terjadi kesalahan saat memuat galeri.');
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
            formDataToSend.append('description', formData.description?.trim() || '');
            if (imageFile) formDataToSend.append('image', imageFile);
            if (editing) formDataToSend.append('_method', 'PUT');

            if (editing) {
                await galleryService.update(editing, formDataToSend);
                showSuccess('Berhasil!', 'Foto berhasil diperbarui.');
            } else {
                await galleryService.create(formDataToSend);
                showSuccess('Berhasil!', 'Foto berhasil ditambahkan.');
            }

            resetForm();
            await fetchGalleries();
        } catch (error) {
            console.error('❌ Error saving gallery:', error);
            let msg = 'Gagal menyimpan foto.';
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
            image: item.image || '',
            description: item.description || ''
        });
        setImagePreview(getImageUrl(item.image));
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        document.querySelector('.gallery-form-container')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (item) => {
        const result = await showConfirmDelete(item.title || 'Tanpa judul');
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
            await galleryService.delete(item.id);
            await fetchGalleries();
            showSuccess('Terhapus!', `Foto "${item.title || 'Tanpa judul'}" berhasil dihapus.`);
        } catch (error) {
            console.error('❌ Error deleting gallery:', error);
            showError('Gagal Menghapus', error.response?.data?.message || 'Terjadi kesalahan saat menghapus foto.');
        }
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({ title: '', image: '', description: '' });
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleCancel = resetForm;

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
                <p>Memuat data galeri...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="gallery-manager-header">
                <h2>
                    <Icons.Grid /> Manajemen Galeri
                    <span> — Kelola foto galeri</span>
                </h2>
            </div>

            <div className="gallery-form-container">
                <div className="gallery-form-title">
                    <span className="form-icon">
                        {editing ? <Icons.Edit /> : <Icons.Plus />}
                    </span>
                    {editing ? 'Edit Foto' : 'Tambah Foto Baru'}
                </div>

                <form onSubmit={handleSubmit} className="gallery-form" encType="multipart/form-data">
                    <div className="form-group full-width">
                        <label htmlFor="title">Judul Foto <span className="required">*</span></label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            placeholder="Masukkan judul foto"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="image">
                            <Icons.Image /> Gambar <span className="required">*</span>
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

                    <div className="form-group full-width">
                        <label htmlFor="description">Deskripsi / Caption</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Masukkan deskripsi atau caption foto"
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
                                <>{editing ? <Icons.Edit /> : <Icons.Plus />}{editing ? 'Update Foto' : 'Tambah Foto'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="gallery-grid-header">
                <h3>Galeri Foto</h3>
                <span className="gallery-count">{galleries.length} foto</span>
            </div>

            <div className="gallery-grid-admin">
                {galleries.length === 0 ? (
                    <div className="no-data" style={{ gridColumn: '1 / -1' }}>
                        <div className="no-data-icon">🖼️</div>
                        <div className="no-data-text">Belum ada foto</div>
                        <div className="no-data-subtext">Tambahkan foto baru menggunakan form di atas</div>
                    </div>
                ) : (
                    galleries.map((item) => (
                        <div key={item.id} className="gallery-card-admin">
                            <div className="gallery-image-wrapper">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.title || item.description || 'Galeri'}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                    }}
                                />
                                <div className="image-overlay">
                                    <div className="image-actions">
                                        <button className="btn-edit-overlay" onClick={() => handleEdit(item)} title="Edit">
                                            <Icons.Edit />
                                        </button>
                                        <button className="btn-delete-overlay" onClick={() => handleDelete(item)} title="Hapus">
                                            <Icons.Delete />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="gallery-caption">
                                <p className="caption-text">{item.title || 'Tanpa judul'}</p>
                                <div className="caption-meta">
                                    <span className="caption-date">
                                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
                                    </span>
                                    <span className="caption-id">#{item.id}</span>
                                </div>
                                {item.description && (
                                    <p className="caption-description">{item.description}</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GalleryManager;
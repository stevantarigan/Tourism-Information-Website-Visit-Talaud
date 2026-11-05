// pages/Admin/components/HeroManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import heroService from '../../../services/heroService';
import getImageUrl from '../../../utils/imageHelper';
import './HeroManager.css';

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
    Swal.fire({
        ...swalConfig,
        icon: 'success',
        title,
        text,
        timer: 2200,
        timerProgressBar: true,
        showConfirmButton: false,
    });

const showError = (title, text) =>
    Swal.fire({
        ...swalConfig,
        icon: 'error',
        title,
        text,
        confirmButtonText: 'Tutup',
    });

const showConfirmDelete = (title) =>
    Swal.fire({
        ...swalConfig,
        icon: 'warning',
        title: 'Hapus Hero?',
        html: `Anda akan menghapus <b>"${title}"</b>.<br/>Tindakan ini tidak dapat dibatalkan.`,
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
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    Sort: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="14" y2="12" />
            <line x1="4" y1="18" x2="18" y2="18" />
        </svg>
    )
};

const HeroManager = () => {
    const [heroes, setHeroes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: '',
        is_active: true,
        sort_order: 0
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchHeroes();
    }, []);

    const fetchHeroes = async () => {
        setLoading(true);
        try {
            const data = await heroService.getAll();
            console.log('📦 Heroes data:', data);
            const sortedData = Array.isArray(data)
                ? [...data].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                : [];
            setHeroes(sortedData);
        } catch (error) {
            console.error('❌ Error fetching heroes:', error);
            showError(
                'Gagal Memuat Data',
                error.response?.data?.message || 'Terjadi kesalahan saat memuat hero.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData(prev => ({ ...prev, image: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('subtitle', formData.subtitle?.trim() || '');
            formDataToSend.append('is_active', formData.is_active ? '1' : '0');
            formDataToSend.append('sort_order', String(parseInt(formData.sort_order) || 0));

            if (editing) {
                if (imageFile) {
                    formDataToSend.append('image', imageFile);
                }
                formDataToSend.append('_method', 'PUT');
            } else {
                if (imageFile) {
                    formDataToSend.append('image', imageFile);
                }
            }

            if (editing) {
                await heroService.update(editing, formDataToSend);
                showSuccess('Berhasil!', 'Hero berhasil diperbarui.');
            } else {
                await heroService.create(formDataToSend);
                showSuccess('Berhasil!', 'Hero baru berhasil ditambahkan.');
            }

            resetForm();
            await fetchHeroes();
        } catch (error) {
            console.error('❌ Error saving hero:', error);

            let msg = 'Gagal menyimpan hero.';
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
        console.log('✏️ Editing item:', item);
        setEditing(item.id);
        setFormData({
            title: item.title || '',
            subtitle: item.subtitle || '',
            image: item.image || '',
            is_active: item.is_active === 1 || item.is_active === true,
            sort_order: item.sort_order || 0
        });
        setImagePreview(getImageUrl(item.image));
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        document.querySelector('.hero-form-container')?.scrollIntoView({ behavior: 'smooth' });
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
            await heroService.delete(item.id);
            await fetchHeroes();

            showSuccess('Terhapus!', `Hero "${item.title}" berhasil dihapus.`);
        } catch (error) {
            console.error('❌ Error deleting hero:', error);
            showError(
                'Gagal Menghapus',
                error.response?.data?.message || 'Terjadi kesalahan saat menghapus hero.'
            );
        }
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({
            title: '',
            subtitle: '',
            image: '',
            is_active: true,
            sort_order: 0
        });
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCancel = resetForm;

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
                <p>Memuat data hero...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="hero-manager-header">
                <h2>
                    Manajemen Hero
                    <span> — Kelola konten hero section</span>
                </h2>
            </div>

            <div className="hero-form-container">
                <div className="hero-form-title">
                    <span className="form-icon">
                        {editing ? <Icons.Edit /> : <Icons.Plus />}
                    </span>
                    {editing ? 'Edit Hero' : 'Tambah Hero Baru'}
                </div>

                <form onSubmit={handleSubmit} className="hero-form" encType="multipart/form-data">
                    <div className="form-group full-width">
                        <label htmlFor="title">
                            Judul Hero <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            placeholder="Masukkan judul hero"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="subtitle">Subtitle</label>
                        <input
                            type="text"
                            id="subtitle"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleInputChange}
                            placeholder="Masukkan subtitle hero"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="image">
                            Gambar Hero
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
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                    }}
                                />
                                <div className="preview-info">
                                    <div className="file-name">
                                        {imageFile ? imageFile.name : 'Gambar saat ini'}
                                    </div>
                                    {imageFile && (
                                        <div className="file-size">
                                            {(imageFile.size / 1024).toFixed(1)} KB
                                        </div>
                                    )}
                                    {editing && !imageFile && (
                                        <div className="file-note" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                                            ⚠️ Gambar akan tetap sama jika tidak diubah
                                        </div>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="btn-remove-image"
                                    onClick={handleRemoveImage}
                                    disabled={isSubmitting}
                                >
                                    <Icons.Close /> Hapus
                                </button>
                            </div>
                        ) : (
                            <div
                                className="file-upload-wrapper"
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.add('dragging');
                                }}
                                onDragLeave={(e) => {
                                    e.currentTarget.classList.remove('dragging');
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.classList.remove('dragging');
                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        const event = { target: { files: [file] } };
                                        handleFileChange(event);
                                    }
                                }}
                            >
                                <div className="upload-icon">
                                    <Icons.Upload />
                                </div>
                                <div className="upload-text">
                                    Klik atau drag & drop untuk upload
                                </div>
                                <div className="upload-subtext">
                                    Format: JPG, PNG, GIF, WEBP • Maks: 2MB
                                </div>
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
                        <label htmlFor="sort_order">
                            Urutan <span className="field-hint">(Semakin kecil, semakin atas)</span>
                        </label>
                        <input
                            type="number"
                            id="sort_order"
                            name="sort_order"
                            value={formData.sort_order}
                            onChange={handleInputChange}
                            placeholder="0"
                            min="0"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label className="checkbox-toggle" htmlFor="is_active">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                            <span className="toggle-label">Aktifkan Hero</span>
                        </label>
                    </div>

                    <div className="form-actions">
                        {editing && (
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Batal
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    {editing ? <Icons.Edit /> : <Icons.Plus />}
                                    {editing ? 'Update Hero' : 'Tambah Hero'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-header">
                <h3>Daftar Hero</h3>
                <span className="table-count">{heroes.length} data</span>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Judul</th>
                            <th>Subtitle</th>
                            <th>Urutan</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {heroes.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    <div className="no-data-icon">📭</div>
                                    <div className="no-data-text">Belum ada data hero</div>
                                    <div className="no-data-subtext">Tambahkan hero baru menggunakan form di atas</div>
                                </td>
                            </tr>
                        ) : (
                            heroes.map((item, index) => (
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
                                    <td>{item.subtitle || '-'}</td>
                                    <td>
                                        <span className="sort-badge">
                                            <Icons.Sort /> {item.sort_order || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${item.is_active ? 'active' : 'inactive'}`}>
                                            <span className="badge-dot" />
                                            {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(item)}
                                                title="Edit"
                                            >
                                                <Icons.Edit />
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(item)}
                                                title="Hapus"
                                            >
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

export default HeroManager;
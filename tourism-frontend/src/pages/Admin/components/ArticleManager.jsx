// pages/Admin/components/ArticleManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import articleService from '../../../services/articleService';
import getImageUrl from '../../../utils/imageHelper';
import './ArticleManager.css';

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
        title: 'Hapus Artikel?',
        html: `Anda akan menghapus artikel <b>"${title}"</b>.<br/>Tindakan ini tidak dapat dibatalkan.`,
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
    Article: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    Slug: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4v16h16" />
            <polyline points="20 10 12 18 8 14" />
        </svg>
    ),
    Calendar: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    Published: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    Image: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    )
};

const ArticleManager = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        thumbnail: '',
        published_at: '',
        is_published: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const data = await articleService.getAll();
            console.log('📦 Articles data:', data);
            setArticles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('❌ Error fetching articles:', error);
            showError(
                'Gagal Memuat Data',
                error.response?.data?.message || 'Terjadi kesalahan saat memuat artikel.'
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

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title: title,
            slug: generateSlug(title)
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
        setFormData(prev => ({ ...prev, thumbnail: '' }));
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
            formDataToSend.append('slug', formData.slug || generateSlug(formData.title));
            formDataToSend.append('content', formData.content.trim());

            if (formData.published_at) {
                formDataToSend.append('published_at', formData.published_at);
            }

            formDataToSend.append('is_published', formData.is_published ? '1' : '0');

            if (imageFile) {
                formDataToSend.append('thumbnail', imageFile);
            }

            if (editing) {
                formDataToSend.append('_method', 'PUT');
            }

            if (editing) {
                await articleService.update(editing, formDataToSend);
                showSuccess('Berhasil!', 'Artikel berhasil diperbarui.');
            } else {
                await articleService.create(formDataToSend);
                showSuccess('Berhasil!', 'Artikel baru berhasil ditambahkan.');
            }

            resetForm();
            await fetchArticles();
        } catch (error) {
            console.error('❌ Error saving article:', error);

            let msg = 'Gagal menyimpan artikel.';
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
        console.log('✏️ Editing article:', item);
        setEditing(item.id);
        setFormData({
            title: item.title || '',
            slug: item.slug || '',
            content: item.content || '',
            thumbnail: item.thumbnail || '',
            published_at: item.published_at || '',
            is_published: item.is_published === 1 || item.is_published === true
        });
        setImagePreview(getImageUrl(item.thumbnail));
        setImageFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        document.querySelector('.article-form-container')?.scrollIntoView({ behavior: 'smooth' });
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
            await articleService.delete(item.id);
            await fetchArticles();
            showSuccess('Terhapus!', `Artikel "${item.title}" berhasil dihapus.`);
        } catch (error) {
            console.error('❌ Error deleting article:', error);
            showError(
                'Gagal Menghapus',
                error.response?.data?.message || 'Terjadi kesalahan saat menghapus artikel.'
            );
        }
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({
            title: '',
            slug: '',
            content: '',
            thumbnail: '',
            published_at: '',
            is_published: false
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
                <p>Memuat data artikel...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="article-manager-header">
                <h2>
                    <Icons.Article /> Manajemen Artikel
                    <span> — Tulis dan edit artikel</span>
                </h2>
            </div>

            <div className="article-form-container">
                <div className="article-form-title">
                    <span className="form-icon">
                        {editing ? <Icons.Edit /> : <Icons.Plus />}
                    </span>
                    {editing ? 'Edit Artikel' : 'Tambah Artikel Baru'}
                </div>

                <form onSubmit={handleSubmit} className="article-form" encType="multipart/form-data">
                    <div className="form-group full-width">
                        <label htmlFor="title">
                            Judul Artikel <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleTitleChange}
                            required
                            placeholder="Masukkan judul artikel"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="slug">
                            <Icons.Slug /> Slug <span className="required">*</span>
                            <span className="field-hint">(URL-friendly name)</span>
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            required
                            placeholder="judul-artikel"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="published_at">
                            <Icons.Calendar /> Tanggal Publikasi
                        </label>
                        <input
                            type="date"
                            id="published_at"
                            name="published_at"
                            value={formData.published_at}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="content">
                            Konten <span className="required">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows="8"
                            required
                            placeholder="Masukkan konten artikel"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="thumbnail">
                            <Icons.Image /> Thumbnail
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
                                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
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
                                        <div className="file-note">
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
                                        handleFileChange({ target: { files: [file] } });
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
                                    id="thumbnail"
                                    name="thumbnail"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group full-width">
                        <label className="checkbox-toggle" htmlFor="is_published">
                            <input
                                type="checkbox"
                                id="is_published"
                                name="is_published"
                                checked={formData.is_published}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                            <span className="toggle-label">
                                <Icons.Published /> Publikasikan Artikel
                            </span>
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
                                    {editing ? 'Update Artikel' : 'Tambah Artikel'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-header">
                <h3>Daftar Artikel</h3>
                <span className="table-count">{articles.length} artikel</span>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Judul</th>
                            <th>Status</th>
                            <th>Tanggal</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    <div className="no-data-icon">📭</div>
                                    <div className="no-data-text">Belum ada data artikel</div>
                                    <div className="no-data-subtext">Tambahkan artikel baru menggunakan form di atas</div>
                                </td>
                            </tr>
                        ) : (
                            articles.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <strong>{item.title}</strong>
                                        {item.thumbnail && (
                                            <div style={{ marginTop: '6px' }}>
                                                <img
                                                    src={getImageUrl(item.thumbnail)}
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
                                    <td>
                                        {item.is_published ? (
                                            <span className="badge badge-published">
                                                <span className="badge-dot" />
                                                Published
                                            </span>
                                        ) : (
                                            <span className="badge badge-draft">
                                                <span className="badge-dot" />
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {item.published_at ? (
                                            new Date(item.published_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                        ) : (
                                            '-'
                                        )}
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

export default ArticleManager;
// pages/Admin/components/DestinationImagesManager.jsx
import React, { useState, useEffect, useRef } from 'react';
import destinationService from '../../../services/destinationService';
import destinationImageService from '../../../services/destinationImageService';
import getImageUrl from '../../../utils/imageHelper';
import './DestinationImagesManager.css';

/* ============================================================
   ICONS
   ============================================================ */
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
    Image: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    ),
    Caption: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7V4h16v3M9 20h6M12 4v16" />
        </svg>
    ),
    Sort: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="14" y2="12" />
            <line x1="4" y1="18" x2="9" y2="18" />
        </svg>
    ),
    Destination: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
};

/* ============================================================
   KOMPONEN UTAMA
   ============================================================ */
const DestinationImagesManager = () => {
    const [images, setImages] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [filterDestination, setFilterDestination] = useState('');
    const [formData, setFormData] = useState({
        destination_id: '',
        caption: '',
        sort_order: 0,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [message, setMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchDestinations();
        fetchImages();
    }, []);

    /* ---------- Fetch destinations ---------- */
    const fetchDestinations = async () => {
        try {
            const data = await destinationService.getAll();
            setDestinations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    /* ---------- Fetch images ---------- */
    const fetchImages = async () => {
        setLoading(true);
        try {
            const data = await destinationImageService.getAll();
            setImages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching images:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Gagal memuat data gambar',
            });
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Input handlers ---------- */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setMessage({
                type: 'error',
                text: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP.',
            });
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Ukuran file terlalu besar. Maksimal 2MB.' });
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        setMessage(null);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    /* ---------- Submit ---------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!editing && !imageFile) {
            setMessage({ type: 'error', text: 'Pilih gambar terlebih dahulu.' });
            return;
        }

        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('destination_id', formData.destination_id);
            if (formData.caption) formDataToSend.append('caption', formData.caption.trim());
            formDataToSend.append('sort_order', formData.sort_order || 0);

            if (imageFile) formDataToSend.append('image', imageFile);

            if (editing) {
                formDataToSend.append('_method', 'PUT');
                await destinationImageService.update(editing, formDataToSend);
                setMessage({ type: 'success', text: 'Gambar berhasil diperbarui!' });
            } else {
                await destinationImageService.create(formDataToSend);
                setMessage({ type: 'success', text: 'Gambar berhasil ditambahkan!' });
            }

            resetForm();
            await fetchImages();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error saving image:', error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(', ');
                setMessage({ type: 'error', text: `Validasi gagal: ${errorMessages}` });
            } else if (error.response?.data?.message) {
                setMessage({ type: 'error', text: error.response.data.message });
            } else {
                setMessage({ type: 'error', text: 'Gagal menyimpan gambar' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ---------- Edit ---------- */
    const handleEdit = (img) => {
        setEditing(img.id);
        setFormData({
            destination_id: img.destination_id || '',
            caption: img.caption || '',
            sort_order: img.sort_order || 0,
        });
        setImagePreview(getImageUrl(img.image));
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        document.querySelector('.destination-image-form-container')?.scrollIntoView({ behavior: 'smooth' });
    };

    /* ---------- Delete ---------- */
    const handleDelete = async (id) => {
        if (
            window.confirm(
                'Yakin ingin menghapus gambar ini? Tindakan ini tidak dapat dibatalkan.'
            )
        ) {
            try {
                await destinationImageService.delete(id);
                setMessage({ type: 'success', text: 'Gambar berhasil dihapus!' });
                await fetchImages();
                setTimeout(() => setMessage(null), 3000);
            } catch (error) {
                console.error('Error deleting image:', error);
                setMessage({
                    type: 'error',
                    text: error.response?.data?.message || 'Gagal menghapus gambar',
                });
            }
        }
    };

    /* ---------- Reset ---------- */
    const resetForm = () => {
        setEditing(null);
        setFormData({
            destination_id: filterDestination || '',
            caption: '',
            sort_order: 0,
        });
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    /* ---------- Filter ---------- */
    const filteredImages = filterDestination
        ? images.filter((img) => String(img.destination_id) === String(filterDestination))
        : images;

    /* ---------- Loading ---------- */
    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
                <p>Memuat data gambar...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            {/* Header */}
            <div className="destination-images-header">
                <h2>
                    Galeri Destinasi
                    <span> — Kelola foto tambahan untuk setiap destinasi</span>
                </h2>
            </div>

            {/* Message */}
            {message && (
                <div className={`message ${message.type}`}>
                    {message.type === 'success' ? '✓' : '✕'} {message.text}
                </div>
            )}

            {/* Form */}
            <div className="destination-image-form-container">
                <div className="destination-image-form-title">
                    <span className="form-icon">
                        {editing ? <Icons.Edit /> : <Icons.Plus />}
                    </span>
                    {editing ? 'Edit Gambar' : 'Tambah Gambar Baru'}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="destination-image-form"
                    encType="multipart/form-data"
                >
                    {/* Destination */}
                    <div className="form-group">
                        <label htmlFor="destination_id">
                            <Icons.Destination /> Destinasi <span className="required">*</span>
                        </label>
                        <select
                            id="destination_id"
                            name="destination_id"
                            value={formData.destination_id}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmitting}
                        >
                            <option value="">Pilih Destinasi</option>
                            {destinations.map((dest) => (
                                <option key={dest.id} value={dest.id}>
                                    {dest.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Order */}
                    <div className="form-group">
                        <label htmlFor="sort_order">
                            <Icons.Sort /> Urutan
                            <span className="field-hint">(angka kecil tampil lebih dulu)</span>
                        </label>
                        <input
                            type="number"
                            id="sort_order"
                            name="sort_order"
                            value={formData.sort_order}
                            onChange={handleInputChange}
                            min="0"
                            placeholder="0"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Caption */}
                    <div className="form-group full-width">
                        <label htmlFor="caption">
                            <Icons.Caption /> Caption
                            <span className="field-hint">(opsional)</span>
                        </label>
                        <input
                            type="text"
                            id="caption"
                            name="caption"
                            value={formData.caption}
                            onChange={handleInputChange}
                            placeholder="Deskripsi singkat gambar"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="form-group full-width">
                        <label htmlFor="image">
                            <Icons.Image /> Gambar
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
                                        e.target.src =
                                            'https://via.placeholder.com/80x80?text=No+Image';
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
                                    if (file) handleFileChange({ target: { files: [file] } });
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

                    {/* Actions */}
                    <div className="form-actions">
                        {editing && (
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={resetForm}
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
                                    {editing ? 'Update Gambar' : 'Tambah Gambar'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="table-header">
                <h3>Daftar Gambar</h3>
                <div className="table-header-right">
                    <select
                        className="filter-select"
                        value={filterDestination}
                        onChange={(e) => setFilterDestination(e.target.value)}
                    >
                        <option value="">Semua Destinasi</option>
                        {destinations.map((dest) => (
                            <option key={dest.id} value={dest.id}>
                                {dest.name}
                            </option>
                        ))}
                    </select>
                    <span className="table-count">
                        {filteredImages.length} gambar
                    </span>
                </div>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Gambar</th>
                            <th>Destinasi</th>
                            <th>Caption</th>
                            <th>Urutan</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredImages.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    <div className="no-data-icon">🖼️</div>
                                    <div className="no-data-text">
                                        Belum ada gambar
                                    </div>
                                    <div className="no-data-subtext">
                                        Tambahkan gambar baru menggunakan form di atas
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredImages.map((img, index) => {
                                const imgUrl = getImageUrl(img.image);
                                const destName =
                                    img.destination?.name ||
                                    destinations.find(
                                        (d) => String(d.id) === String(img.destination_id)
                                    )?.name ||
                                    '-';

                                return (
                                    <tr key={img.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                src={imgUrl}
                                                alt={img.caption || 'Gambar'}
                                                className="table-image"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src =
                                                        'https://via.placeholder.com/48x48?text=No+Image';
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <span className="badge badge-category">
                                                {destName}
                                            </span>
                                        </td>
                                        <td>{img.caption || '-'}</td>
                                        <td>
                                            <span className="badge badge-order">
                                                {img.sort_order ?? 0}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(img)}
                                                    title="Edit"
                                                    type="button"
                                                >
                                                    <Icons.Edit />
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(img.id)}
                                                    title="Hapus"
                                                    type="button"
                                                >
                                                    <Icons.Delete />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DestinationImagesManager;
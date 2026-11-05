import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import destinationService from '../../../services/destinationService';
import getImageUrl from '../../../utils/imageHelper';
import './DestinationsManager.css';

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

const showConfirmDelete = (name) =>
    Swal.fire({
        ...swalConfig,
        icon: 'warning',
        title: 'Hapus Destinasi?',
        html: `Anda akan menghapus destinasi <b>"${name}"</b>.<br/>Tindakan ini tidak dapat dibatalkan.`,
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
    Address: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    ),
    Clock: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    Ticket: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5v2" />
            <path d="M15 11v2" />
            <path d="M15 17v2" />
            <path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
        </svg>
    ),
    Phone: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.574 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    ),
    Slug: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4v16h16" />
            <polyline points="20 10 12 18 8 14" />
        </svg>
    ),
    Active: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
};

const DestinationsManager = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        short_description: '',
        description: '',
        address: '',
        opening_hours: '',
        ticket_price: '',
        contact: '',
        cover_image: '',
        is_active: true
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            const data = await destinationService.getAll();
            setDestinations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching destinations:', error);
            showError(
                'Gagal Memuat Data',
                error.response?.data?.message || 'Terjadi kesalahan saat memuat destinasi.'
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

        if (!file) return;

        const validTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/jpg'
        ];

        if (!validTypes.includes(file.type)) {
            showError(
                'Format Tidak Didukung',
                'Gunakan JPG, PNG, GIF, atau WEBP.'
            );
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
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        setFormData(prev => ({ ...prev, cover_image: '' }));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;

        setFormData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();

            formDataToSend.append('name', formData.name.trim());
            formDataToSend.append(
                'slug',
                formData.slug || generateSlug(formData.name)
            );
            formDataToSend.append('description', formData.description.trim());

            if (formData.short_description) {
                formDataToSend.append(
                    'short_description',
                    formData.short_description.trim()
                );
            }

            if (formData.address) {
                formDataToSend.append('address', formData.address.trim());
            }

            if (formData.opening_hours) {
                formDataToSend.append(
                    'opening_hours',
                    formData.opening_hours.trim()
                );
            }

            if (formData.ticket_price) {
                formDataToSend.append(
                    'ticket_price',
                    formData.ticket_price.trim()
                );
            }

            if (formData.contact) {
                formDataToSend.append('contact', formData.contact.trim());
            }

            formDataToSend.append('is_active', formData.is_active ? '1' : '0');

            if (imageFile) {
                formDataToSend.append('cover_image', imageFile);
            }

            if (editing) {
                formDataToSend.append('_method', 'PUT');
            }

            if (editing) {
                await destinationService.update(editing, formDataToSend);
                showSuccess('Berhasil!', 'Destinasi berhasil diperbarui.');
            } else {
                await destinationService.create(formDataToSend);
                showSuccess('Berhasil!', 'Destinasi baru berhasil ditambahkan.');
            }

            resetForm();
            await fetchDestinations();
        } catch (error) {
            console.error('Error saving destination:', error);

            let msg = 'Gagal menyimpan destinasi.';

            if (error.response?.data?.errors) {
                msg = Object.values(error.response.data.errors)
                    .flat()
                    .join(', ');
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            }

            showError('Gagal Menyimpan', msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (dest) => {
        setEditing(dest.id);

        setFormData({
            name: dest.name || '',
            slug: dest.slug || '',
            short_description: dest.short_description || '',
            description: dest.description || '',
            address: dest.address || '',
            opening_hours: dest.opening_hours || '',
            ticket_price: dest.ticket_price || '',
            contact: dest.contact || '',
            cover_image: dest.cover_image || '',
            is_active: dest.is_active === 1 || dest.is_active === true
        });

        setImagePreview(getImageUrl(dest.cover_image));
        setImageFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        document
            .querySelector('.destination-form-container')
            ?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (dest) => {
        const result = await showConfirmDelete(dest.name);

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
            await destinationService.delete(dest.id);
            await fetchDestinations();

            showSuccess(
                'Terhapus!',
                `Destinasi "${dest.name}" berhasil dihapus.`
            );
        } catch (error) {
            console.error('Error deleting destination:', error);
            showError(
                'Gagal Menghapus',
                error.response?.data?.message ||
                    'Terjadi kesalahan saat menghapus destinasi.'
            );
        }
    };

    const resetForm = () => {
        setEditing(null);

        setFormData({
            name: '',
            slug: '',
            short_description: '',
            description: '',
            address: '',
            opening_hours: '',
            ticket_price: '',
            contact: '',
            cover_image: '',
            is_active: true
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
                <p>Memuat data destinasi...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="destinations-manager-header">
                <h2>
                    Manajemen Destinasi
                    <span> — Kelola data destinasi wisata</span>
                </h2>
            </div>

            <div className="destination-form-container">
                <div className="destination-form-title">
                    <span className="form-icon">
                        {editing ? <Icons.Edit /> : <Icons.Plus />}
                    </span>
                    {editing ? 'Edit Destinasi' : 'Tambah Destinasi Baru'}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="destination-form"
                    encType="multipart/form-data"
                >
                    <div className="form-group full-width">
                        <label htmlFor="name">
                            Nama Destinasi <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                            placeholder="Masukkan nama destinasi"
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
                            placeholder="nama-destinasi"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="short_description">Deskripsi Singkat</label>
                        <input
                            type="text"
                            id="short_description"
                            name="short_description"
                            value={formData.short_description}
                            onChange={handleInputChange}
                            placeholder="Deskripsi singkat destinasi"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="description">
                            Deskripsi <span className="required">*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            required
                            placeholder="Deskripsi lengkap destinasi"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="address">
                            <Icons.Address /> Alamat
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Alamat lengkap destinasi"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="opening_hours">
                            <Icons.Clock /> Jam Operasional
                        </label>
                        <input
                            type="text"
                            id="opening_hours"
                            name="opening_hours"
                            value={formData.opening_hours}
                            onChange={handleInputChange}
                            placeholder="08:00 - 17:00"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ticket_price">
                            <Icons.Ticket /> Harga Tiket
                        </label>
                        <input
                            type="text"
                            id="ticket_price"
                            name="ticket_price"
                            value={formData.ticket_price}
                            onChange={handleInputChange}
                            placeholder="Rp 50.000"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact">
                            <Icons.Phone /> Kontak
                        </label>
                        <input
                            type="text"
                            id="contact"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            placeholder="0812-3456-7890"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="cover_image">
                            Gambar Cover
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
                                        handleFileChange({
                                            target: { files: [file] }
                                        });
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
                                    id="cover_image"
                                    name="cover_image"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}
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
                            <span className="toggle-label">
                                <Icons.Active /> Aktif
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
                                    {editing ? 'Update Destinasi' : 'Tambah Destinasi'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-header">
                <h3>Daftar Destinasi</h3>
                <span className="table-count">{destinations.length} data</span>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nama</th>
                            <th>Lokasi</th>
                            <th>Kunjungan</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>

                    <tbody>
                        {destinations.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    <div className="no-data-icon">📭</div>
                                    <div className="no-data-text">Belum ada data destinasi</div>
                                    <div className="no-data-subtext">
                                        Tambahkan destinasi baru menggunakan form di atas
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            destinations.map((dest, index) => (
                                <tr key={dest.id}>
                                    <td>{index + 1}</td>

                                    <td>
                                        <strong>{dest.name}</strong>

                                        {dest.cover_image && (
                                            <div style={{ marginTop: '6px' }}>
                                                <img
                                                    src={getImageUrl(dest.cover_image)}
                                                    alt={dest.name}
                                                    className="table-image"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </td>

                                    <td>{dest.address || dest.location || '-'}</td>
                                    <td>{Number(dest.view_count || 0).toLocaleString('id-ID')}</td>

                                    <td>
                                        <span className={`badge ${dest.is_active ? 'active' : 'inactive'}`}>
                                            <span className="badge-dot" />
                                            {dest.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEdit(dest)}
                                                title="Edit"
                                            >
                                                <Icons.Edit />
                                            </button>

                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDelete(dest)}
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

export default DestinationsManager;
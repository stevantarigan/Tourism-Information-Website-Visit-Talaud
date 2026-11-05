// pages/Admin/components/UserManager.jsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import userService from '../../../services/userService';
import './UserManager.css';

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

const showConfirmDelete = (name) =>
    Swal.fire({
        ...swalConfig,
        icon: 'warning',
        title: 'Hapus User?',
        html: `Anda akan menghapus user <b>"${name}"</b>.<br/>Tindakan ini tidak dapat dibatalkan.`,
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    Delete: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    ),
    User: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    Users: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    Email: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    ),
    Lock: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    )
};

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAll();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('❌ Error fetching users:', error);
            showError('Gagal Memuat Data', error.response?.data?.message || 'Terjadi kesalahan saat memuat user.');
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
                name: formData.name.trim(),
                email: formData.email.trim(),
            };

            if (formData.password) {
                submitData.password = formData.password;
                submitData.password_confirmation = formData.password_confirmation;
            }

            if (editing) {
                await userService.update(editing, submitData);
                showSuccess('Berhasil!', 'User berhasil diperbarui.');
            } else {
                await userService.create(submitData);
                showSuccess('Berhasil!', 'User baru berhasil ditambahkan.');
            }

            resetForm();
            await fetchUsers();
        } catch (error) {
            console.error('❌ Error saving user:', error);
            let msg = 'Gagal menyimpan user.';
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
            name: item.name || '',
            email: item.email || '',
            password: '',
            password_confirmation: ''
        });
        document.querySelector('.user-manager-container')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (item) => {
        const result = await showConfirmDelete(item.name);
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
            await userService.delete(item.id);
            await fetchUsers();
            showSuccess('Terhapus!', `User "${item.name}" berhasil dihapus.`);
        } catch (error) {
            console.error('❌ Error deleting user:', error);
            showError('Gagal Menghapus', error.response?.data?.message || 'Terjadi kesalahan saat menghapus user.');
        }
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({ name: '', email: '', password: '', password_confirmation: '' });
    };

    const handleCancel = resetForm;

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner" />
                <p>Memuat data user...</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="user-manager-header">
                <h2>
                    <Icons.Users /> Manajemen User
                    <span> — Kelola akun administrator</span>
                </h2>
            </div>

            <div className="user-manager-container">
                <div className="user-manager-title">
                    <span className="form-icon">
                        {editing ? <Icons.Edit /> : <Icons.Plus />}
                    </span>
                    {editing ? 'Edit User' : 'Tambah User Baru'}
                </div>

                <form onSubmit={handleSubmit} className="user-manager-form">
                    <div className="form-group">
                        <label htmlFor="name"><Icons.User /> Nama <span className="required">*</span></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Masukkan nama lengkap"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email"><Icons.Email /> Email <span className="required">*</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Masukkan email"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <Icons.Lock /> Password
                            {editing && <span className="field-hint">(Kosongkan jika tidak ingin mengubah)</span>}
                            {!editing && <span className="required">*</span>}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required={!editing}
                            placeholder={editing ? "Kosongkan jika tidak diubah" : "Masukkan password"}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_confirmation">
                            <Icons.Lock /> Konfirmasi Password
                            {!editing && <span className="required">*</span>}
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleInputChange}
                            required={!editing}
                            placeholder={editing ? "Kosongkan jika tidak diubah" : "Konfirmasi password"}
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
                                <>{editing ? <Icons.Edit /> : <Icons.Plus />}{editing ? 'Update User' : 'Tambah User'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-header">
                <h3>Daftar User</h3>
                <span className="table-count">{users.length} user</span>
            </div>

            <div className="data-table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Tanggal Dibuat</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    <div className="no-data-icon">👤</div>
                                    <div className="no-data-text">Belum ada data user</div>
                                    <div className="no-data-subtext">Tambahkan user baru menggunakan form di atas</div>
                                </td>
                            </tr>
                        ) : (
                            users.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td><strong>{item.name}</strong></td>
                                    <td>{item.email}</td>
                                    <td>
                                        {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : '-'}
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

export default UserManager;
import React, { useState, useEffect } from 'react';
import contactService from '../../../services/contactService';
import './Contact.css';

const Contact = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await contactService.getAll();
                const data = response?.data ?? response;
                setContacts(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message || 'Gagal memuat informasi kontak');
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    if (loading) {
        return (
            <div className="contact-loading">
                <div className="spinner"></div>
                <p>Memuat informasi kontak...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="contact-error">
                <p>❌ {error}</p>
            </div>
        );
    }

    return (
        <section id="contact" className="contact">
            <div className="contact-header">
                <h2>Hubungi Kami</h2>
                <div className="title-underline"></div>
                <p className="contact-subtitle">
                    Jangan ragu untuk menghubungi kami melalui informasi di bawah ini
                </p>
            </div>

            <div className="contact-cards">
                {contacts.length === 0 ? (
                    <div className="no-data">
                        <span className="no-data-icon">📭</span>
                        <p>Belum ada informasi kontak tersedia</p>
                    </div>
                ) : (
                    contacts.map((c) => (
                        <div className="contact-card" key={c.id}>
                            {c.email && (
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <span>📧</span>
                                    </div>
                                    <div className="contact-detail">
                                        <h4>Email</h4>
                                        <a href={`mailto:${c.email}`}>{c.email}</a>
                                    </div>
                                </div>
                            )}

                            {c.phone && (
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <span>📞</span>
                                    </div>
                                    <div className="contact-detail">
                                        <h4>Telepon</h4>
                                        <a href={`tel:${c.phone}`}>{c.phone}</a>
                                    </div>
                                </div>
                            )}

                            {c.address && (
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <span>📍</span>
                                    </div>
                                    <div className="contact-detail">
                                        <h4>Alamat</h4>
                                        <p>{c.address}</p>
                                    </div>
                                </div>
                            )}

                            {c.operational_hour && (
                                <div className="contact-item">
                                    <div className="contact-icon">
                                        <span>🕒</span>
                                    </div>
                                    <div className="contact-detail">
                                        <h4>Jam Operasional</h4>
                                        <p>{c.operational_hour}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default Contact;
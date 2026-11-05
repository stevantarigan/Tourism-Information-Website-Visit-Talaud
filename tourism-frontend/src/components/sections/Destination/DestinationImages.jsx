import React, { useState, useEffect } from 'react';
import destinationImageService from '../../../services/destinationImageService';
// Jika file DestinationImages.css tidak ada, hapus baris ini atau buat file kosong.
// import './DestinationImages.css';

const DestinationImages = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await destinationImageService.getAll();
                setImages(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError(err.message || 'Gagal memuat gambar destinasi');
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    if (loading) return <div className="destination-images-loading">Loading Images...</div>;
    if (error) return <div className="destination-images-error">Error: {error}</div>;

    return (
        <section className="destination-images">
            <h2>Destination Images</h2>
            <div className="image-grid">
                {images.length === 0 ? (
                    <p>No images found</p>
                ) : (
                    images.map((img) => (
                        <div key={img.id} className="image-item">
                            <img src={img.image} alt={img.caption || 'Destination'} />
                            <p>{img.caption}</p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default DestinationImages;
// pages/Admin/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ text = 'Memuat data...' }) => (
    <div className="loading">
        <div className="loading-spinner" />
        <p style={{ marginTop: '12px', fontWeight: 500 }}>{text}</p>
    </div>
);

export default LoadingSpinner;
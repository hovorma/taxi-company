import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function CarFilter({ onFilter }) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const initialSearchTerm = params.get('search') || '';
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

    useEffect(() => {
        setSearchTerm(initialSearchTerm);
    }, [initialSearchTerm]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onFilter(value);
    };

    return (
        <div className="mb-3">
            <input
                type="text"
                placeholder="Поиск по марке, модели или номеру"
                value={searchTerm}
                onChange={handleInputChange}
                className="form-control"
            />
        </div>
    );
}

export default CarFilter;

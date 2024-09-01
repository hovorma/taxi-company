import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function DriverFilter({ onFilter, cars }) {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const initialSearchTerm = params.get('search') || '';
    const initialCarId = params.get('car') || '';
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [selectedCarId, setSelectedCarId] = useState(initialCarId);

    useEffect(() => {
        setSearchTerm(initialSearchTerm);
        setSelectedCarId(initialCarId);
    }, [initialSearchTerm, initialCarId]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onFilter(value, selectedCarId);
    };

    const handleCarChange = (e) => {
        const value = e.target.value;
        setSelectedCarId(value);
        onFilter(searchTerm, value);
    };

    return (
        <div className="mb-3">
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <input
                        type="text"
                        placeholder="Поиск по имени водителя"
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="form-control mb-3"
                    />
                </div>
                <div className="col-md-6 col-sm-12">
                    <select
                        className="form-control"
                        value={selectedCarId}
                        onChange={handleCarChange}
                    >
                        <option value="">Все машины</option>
                        {cars.map(car => (
                            <option key={car.id} value={car.id}>
                                {car.brand} {car.model} ({car.number})
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default DriverFilter;

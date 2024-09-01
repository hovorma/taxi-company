import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Table, Container, Spinner, Pagination } from 'react-bootstrap';
import DriverFilter from "./DriverFilter";

function DriverList() {
    const [drivers, setDrivers] = useState([]);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false); // Track loading state
    const [totalDrivers, setTotalDrivers] = useState(0);
    const [limit] = useState(10); // Limit per page
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchDrivers = (searchTerm, carId, page) => {
        setLoading(true); // Start loading

        let url = `/api/drivers?search=${encodeURIComponent(searchTerm)}&limit=${limit}&page=${page}`;
        if (carId) {
            url += `&car=${carId}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                setDrivers(data.drivers);
                setTotalDrivers(data.total);
                setPage(page);
                setLoading(false); // Stop loading
            })
            .catch(() => setLoading(false)); // Stop loading on error
    };

    useEffect(() => {
        fetch('/api/cars')
            .then(response => response.json())
            .then(data => setCars(data.cars));
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchTerm = params.get('search') || '';
        const carId = params.get('car') || '';
        const pageParam = parseInt(params.get('page')) || 1;
        fetchDrivers(searchTerm, carId, pageParam);
    }, [location.search]);

    const handleFilter = (searchTerm, carId) => {
        const query = new URLSearchParams();
        if (searchTerm) query.set('search', searchTerm);
        if (carId) query.set('car', carId);
        query.set('page', 1);
        navigate(`?${query.toString()}`, { replace: true });
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        navigate(`?${params.toString()}`, { replace: true });
    };

    const handleAddDriver = () => {
        navigate('/drivers/new');
    };

    const handleEditDriver = (id) => {
        navigate(`/drivers/${id}/edit`);
    };

    const handleDriverHistory = (id) => {
        navigate(`/drivers/${id}/history`);
    };

    const handleDeleteDriver = (id) => {
        const handleDeleteDriver = (id) => {
            if (window.confirm('Вы уверены, что хотите удалить этого водителя?')) {
                fetch(`/api/drivers/${id}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            window.location.reload();
                        } else {
                            alert('Ошибка при удалении водителя.');
                        }
                    })
                    .catch(() => {
                        alert('Ошибка при удалении водителя.');
                    });
            }
        };
    };

    const totalPages = Math.ceil(totalDrivers / limit);

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Управление водителями</h2>
                <Button variant="primary" onClick={handleAddDriver}>
                    Добавить водителя
                </Button>
            </div>
            <DriverFilter onFilter={handleFilter} cars={cars} />
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Загрузка...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Дата рождения</th>
                            <th>Машина</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {drivers.map(driver => (
                            <tr key={driver.id}>
                                <td>{driver.name}</td>
                                <td>{new Date(driver.birthday).toLocaleDateString()}</td>
                                <td>{driver.car.brand} {driver.car.model} ({driver.car.number})</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => handleEditDriver(driver.id)}
                                        className="me-2"
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteDriver(driver.id)}
                                        className="me-2"
                                    >
                                        Удалить
                                    </Button>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => handleDriverHistory(driver.id)}
                                    >
                                        История
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>Всего водителей: {totalDrivers}</div>
                        <Pagination className="mb-0">
                            {Array.from({length: totalPages}, (_, i) => (
                                <Pagination.Item
                                    key={i + 1}
                                    active={i + 1 === page}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                </>
            )}
        </Container>
    );
}

export default DriverList;

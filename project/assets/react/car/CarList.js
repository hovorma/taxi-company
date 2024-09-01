import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Table, Container, Spinner, Pagination } from 'react-bootstrap';
import CarFilter from './CarFilter';

function CarList() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCars, setTotalCars] = useState(0);
    const [limit] = useState(10); // Limit per page
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchTerm = params.get('search') || '';
        const pageParam = parseInt(params.get('page')) || 1;

        fetchCars(searchTerm, pageParam);
    }, [location.search]);

    const fetchCars = (searchTerm, page) => {
        setLoading(true);
        fetch(`/api/cars?search=${encodeURIComponent(searchTerm)}&limit=${limit}&page=${page}`)
            .then(response => response.json())
            .then(data => {
                setCars(data.cars);
                setTotalCars(data.total);
                setPage(page);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const handleFilter = (searchTerm) => {
        const query = new URLSearchParams();
        if (searchTerm) query.set('search', searchTerm);
        query.set('page', 1);
        navigate(`?${query.toString()}`, { replace: true });
    };

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        navigate(`?${params.toString()}`, { replace: true });
    };

    const handleAddCar = () => {
        navigate('/cars/new');
    };

    const handleEditCar = (id) => {
        navigate(`/cars/${id}/edit`);
    };

    const handleDeleteCar = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
            fetch(`/api/cars/${id}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        window.location.reload();
                    } else {
                        alert('Ошибка при удалении автомобиля');
                    }
                })
                .catch(() => {
                    alert('Ошибка при соединении с сервером');
                });
        }
    };

    const totalPages = Math.ceil(totalCars / limit);

    return (
        <Container className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Управление автомобилями</h2>
                <Button variant="primary" onClick={handleAddCar}>
                    Добавить автомобиль
                </Button>
            </div>
            <CarFilter onFilter={handleFilter} />
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
                            <th>Марка</th>
                            <th>Модель</th>
                            <th>Номер</th>
                            <th>Действия</th>
                        </tr>
                        </thead>
                        <tbody>
                        {cars.map(car => (
                            <tr key={car.id}>
                                <td>{car.brand}</td>
                                <td>{car.model}</td>
                                <td>{car.number}</td>
                                <td>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => handleEditCar(car.id)}
                                        className="me-2"
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteCar(car.id)}
                                    >
                                        Удалить
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>Всего водителей: {totalCars}</div>
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

export default CarList;
